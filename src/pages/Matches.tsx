
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
  university: string | null;
  hobbies?: string[];
  ideologies?: string[];
  languages?: string[];
  learning_languages?: string[];
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

  const handleMatch = async (event: React.MouseEvent, matchUserId: string) => {
    event.stopPropagation(); // カード全体のクリックイベントが発火するのを防ぐ
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

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

  const handleCardClick = (profileId: string) => {
    navigate(`/profile/${profileId}`);
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
    <div className="py-6">
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
        <div className="space-y-4">
          {filteredProfiles.map((profile) => (
            <Card 
              key={profile.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCardClick(profile.id)}
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={`${profile.first_name}のプロフィール`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">
                  {profile.first_name} {profile.last_name}
                  {profile.age && <span className="text-base font-normal text-muted-foreground ml-2">{profile.age}歳</span>}
                </h3>
                
                {profile.university && (
                  <p className="text-muted-foreground text-sm mb-3">
                    {profile.university}
                  </p>
                )}

                {profile.about_me && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {profile.about_me}
                  </p>
                )}

                {profile.hobbies && profile.hobbies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.hobbies.map((hobby) => (
                      <Badge key={hobby} variant="secondary">
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                )}

                {(profile.languages || profile.learning_languages) && (
                  <div className="mb-4">
                    {profile.languages && (
                      <div className="text-sm mb-1">
                        使用言語: {profile.languages.join(", ")}
                      </div>
                    )}
                    {profile.learning_languages && (
                      <div className="text-sm text-muted-foreground">
                        学習中: {profile.learning_languages.join(", ")}
                      </div>
                    )}
                  </div>
                )}

                <Button 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={(e) => handleMatch(e, profile.id)}
                >
                  メッセージを送る
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredProfiles.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          マッチするユーザーが見つかりませんでした
        </div>
      )}
    </div>
  );
}
