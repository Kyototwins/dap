
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useUserMatchStatus({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkIfMatched();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const checkIfMatched = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsMatched(false);
        return;
      }

      const { data: existingMatch, error } = await supabase
        .from("matches")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .or(`user1_id.eq.${id},user2_id.eq.${id}`);

      if (error) {
        setIsMatched(false);
        return;
      }
      if (existingMatch && existingMatch.length > 0) {
        setIsMatched(true);
      } else {
        setIsMatched(false);
      }
    } catch {
      setIsMatched(false);
    }
  };

  const handleMatch = async ({ id }: { id: string }) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      const { data: existingMatch, error: matchError } = await supabase
        .from("matches")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .or(`user1_id.eq.${id},user2_id.eq.${id}`);

      if (matchError) throw matchError;
      if (existingMatch && existingMatch.length > 0) {
        toast({
          title: "既にマッチしています",
          description: "このユーザーとは既にマッチしています。",
        });
        setIsMatched(true);
        return;
      }

      const { error: createError } = await supabase
        .from("matches")
        .insert([
          {
            user1_id: user.id,
            user2_id: id,
            status: "pending"
          },
        ]);
      if (createError) throw createError;

      toast({
        title: "マッチングリクエストを送信しました",
        description: "相手がマッチングを承認すると、メッセージを送ることができます。",
      });
      setIsMatched(true);
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

  return { isMatched, isLoading, checkIfMatched, handleMatch };
}
