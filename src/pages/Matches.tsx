
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      <h1 className="text-2xl font-bold text-amber-600 mb-6">マッチング</h1>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="ユーザーを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-amber-200 focus-visible:ring-amber-500 bg-white/70 backdrop-blur-sm"
          />
        </div>
        <Button 
          size="icon" 
          variant="outline" 
          className="bg-white/70 backdrop-blur-sm border-amber-200"
        >
          <Filter className="h-4 w-4 text-amber-600" />
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-600 border-r-transparent"></div>
          <p className="mt-2 text-muted-foreground">読み込み中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredProfiles.map((profile) => (
            <Card 
              key={profile.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer glass-card"
              onClick={() => handleCardClick(profile.id)}
            >
              <div className="flex flex-col md:flex-row">
                <div className="aspect-square w-full md:w-1/3 relative overflow-hidden">
                  <img
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt={`${profile.first_name}のプロフィール`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-1 text-amber-800">
                        {profile.first_name} {profile.last_name}
                        {profile.age && <span className="text-base font-normal text-muted-foreground ml-2">{profile.age}歳</span>}
                      </h3>
                      
                      {profile.university && (
                        <p className="text-muted-foreground text-sm mb-3">
                          {profile.university}
                        </p>
                      )}
                    </div>
                  </div>

                  {profile.about_me && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {profile.about_me}
                    </p>
                  )}

                  {profile.hobbies && profile.hobbies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profile.hobbies.map((hobby) => (
                        <Badge key={hobby} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                          {hobby}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {(profile.languages || profile.learning_languages) && (
                    <div className="mb-4">
                      {profile.languages && (
                        <div className="text-sm mb-1 flex items-center gap-1">
                          <span className="font-medium text-gray-700">使用言語:</span> 
                          <span className="text-gray-600">{profile.languages.join(", ")}</span>
                        </div>
                      )}
                      {profile.learning_languages && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <span className="font-medium">学習中:</span> 
                          <span>{profile.learning_languages.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <Button 
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white btn-hover-effect"
                    onClick={(e) => handleMatch(e, profile.id)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    マッチング申請
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredProfiles.length === 0 && (
        <div className="text-center py-8 glass-card p-6">
          <div className="text-amber-600 mb-2">
            <Search className="h-12 w-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-lg font-medium mb-1">マッチするユーザーが見つかりませんでした</h3>
          <p className="text-muted-foreground">検索条件を変更して再度お試しください</p>
        </div>
      )}
    </div>
  );
}
