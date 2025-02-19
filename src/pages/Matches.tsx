
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  avatar_url: string | null;
  about_me: string | null;
}

export default function Matches() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async (matchUserId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      // すでにマッチしているか確認
      const { data: existingMatch, error: matchError } = await supabase
        .from("matches")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .or(`user1_id.eq.${matchUserId},user2_id.eq.${matchUserId}`);

      if (matchError) throw matchError;

      if (existingMatch && existingMatch.length > 0) {
        toast({
          title: "既にマッチしています",
          description: "このユーザーとは既にマッチしています。",
        });
        return;
      }

      // マッチを作成
      const { error: createError } = await supabase
        .from("matches")
        .insert([
          {
            user1_id: user.id,
            user2_id: matchUserId,
          },
        ]);

      if (createError) throw createError;

      toast({
        title: "マッチングリクエストを送信しました",
        description: "相手がマッチングを承認すると、メッセージを送ることができます。",
      });
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      profile.first_name?.toLowerCase().includes(searchLower) ||
      profile.last_name?.toLowerCase().includes(searchLower) ||
      profile.about_me?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="ユーザーを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">読み込み中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video">
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={`${profile.first_name}のプロフィール画像`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <img
                      src={profile.avatar_url || "/placeholder.svg"}
                      alt={`${profile.first_name}のアバター`}
                    />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {profile.first_name} {profile.last_name}
                    </h3>
                    {profile.age && <p className="text-sm text-gray-600">{profile.age}歳</p>}
                  </div>
                </div>
                {profile.about_me && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{profile.about_me}</p>
                )}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/profile/${profile.id}`)}
                  >
                    プロフィールを見る
                  </Button>
                  <Button onClick={() => handleMatch(profile.id)}>
                    マッチする
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredProfiles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          マッチするユーザーが見つかりませんでした
        </div>
      )}
    </div>
  );
}
