
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Ban } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlockButtonProps {
  otherUserId: string;
  disabled?: boolean;
}

export function BlockButton({ otherUserId, disabled }: BlockButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBlock = async () => {
    if (!window.confirm("この相手をブロックしますか？")) return;
    setIsLoading(true);
    try {
      // `blocks` テーブルが存在しない場合は supabase 側作成が必要（ここでは仮実装）
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      const { error } = await supabase.from("blocks").insert([
        {
          blocker_id: user.id,
          blocked_id: otherUserId,
        },
      ]);
      if (error) throw error;

      toast({
        title: "ブロックしました",
        description: "このユーザーからのメッセージ等は届きません。",
      });
    } catch (error: any) {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBlock}
      variant="destructive"
      className="flex-1 gap-2 rounded-xl"
      disabled={isLoading || disabled}
    >
      <Ban className="w-4 h-4" />
      ブロック
    </Button>
  );
}
