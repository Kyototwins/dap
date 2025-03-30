
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/messages";

interface UserCardProps {
  profile: Profile;
}

export function UserCard({ profile }: UserCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMatch = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      const { data: existingMatch, error: matchError } = await supabase
        .from("matches")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .or(`user1_id.eq.${profile.id},user2_id.eq.${profile.id}`);

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
            user2_id: profile.id,
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = () => {
    navigate(`/profile/${profile.id}`);
  };

  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`;

  return (
    <div className="relative overflow-hidden rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="aspect-square w-full md:w-1/3 relative overflow-hidden">
          <Avatar className="w-full h-full rounded-none">
            <AvatarImage
              src={profile.avatar_url || "/placeholder.svg"}
              alt={`${profile.first_name || ''}のプロフィール`}
              className="w-full h-full object-cover"
            />
            <AvatarFallback className="w-full h-full text-2xl rounded-none">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="p-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-1 text-amber-800">
                {profile.first_name} {profile.last_name}
                {profile.age && <span className="text-base font-normal text-muted-foreground ml-2">{profile.age}歳</span>}
              </h3>
              
              {profile.university && (
                <p className="text-muted-foreground text-sm mb-1">
                  {profile.university}
                </p>
              )}
              
              {profile.department && profile.year && (
                <p className="text-muted-foreground text-xs mb-3">
                  {profile.department} • {profile.year}
                </p>
              )}
            </div>
          </div>

          {profile.about_me && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {profile.about_me}
            </p>
          )}

          {profile.learning_languages && profile.learning_languages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.learning_languages.map((lang) => (
                <Badge key={lang} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                  {lang}学習中
                </Badge>
              ))}
            </div>
          )}

          {profile.hobbies && profile.hobbies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.hobbies.slice(0, 3).map((hobby) => (
                <Badge key={hobby} className="bg-amber-100/50 text-amber-700 hover:bg-amber-100">
                  {hobby}
                </Badge>
              ))}
              {profile.hobbies.length > 3 && (
                <Badge className="bg-amber-50 text-amber-700">+{profile.hobbies.length - 3}</Badge>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleViewProfile}
            >
              詳細
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button 
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
              onClick={handleMatch}
              disabled={isLoading}
            >
              <Heart className="w-4 h-4 mr-2" />
              いいね
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
