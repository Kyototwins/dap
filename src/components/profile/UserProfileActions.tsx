
import { useState } from "react";
import { Edit, MessageSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserProfileActionsProps {
  isCurrentUser: boolean;
  profileId: string;
  onMessageClick: () => void;
  onEditProfileClick: () => void;
}

export function UserProfileActions({ 
  isCurrentUser, 
  profileId,
  onMessageClick, 
  onEditProfileClick 
}: UserProfileActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMatch = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      const { data: existingMatch, error: matchError } = await supabase
        .from("matches")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .or(`user1_id.eq.${profileId},user2_id.eq.${profileId}`);

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
            user2_id: profileId,
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

  return (
    <div className="flex gap-3 mb-6">
      <Button 
        onClick={onMessageClick}
        variant="outline"
        className="flex-1 gap-2 border-gray-200"
      >
        <MessageSquare className="w-4 h-4" />
        <span>メッセージ</span>
      </Button>
      
      {isCurrentUser ? (
        <Button 
          onClick={onEditProfileClick}
          className="flex-1 gap-2 bg-doshisha-purple hover:bg-doshisha-darkPurple"
        >
          <Edit className="w-4 h-4" />
          <span>編集</span>
        </Button>
      ) : (
        <Button 
          onClick={handleMatch}
          disabled={isLoading}
          className="flex-1 gap-2 bg-gradient-to-r from-doshisha-purple to-doshisha-lightPurple hover:from-doshisha-darkPurple hover:to-doshisha-purple text-white"
        >
          <Heart className="w-4 h-4 mr-2" />
          いいね
        </Button>
      )}
    </div>
  );
}
