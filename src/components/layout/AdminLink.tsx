
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export function AdminLink() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  // 特定のメールアドレスのみに表示
  if (!user || user.email !== "takerinauni@gmail.com") {
    return null;
  }

  const handleDigestClick = async () => {
    try {
      setSending(true);
      console.log("Sending digest emails to all users with digest enabled");
      
      const { data, error } = await supabase.functions.invoke("send-daily-digest");
      
      if (error) {
        throw error;
      }
      
      if (data?.success) {
        toast({
          title: "ダイジェストメールを送信しました",
          description: `${data.processed}人のユーザーに処理しました。詳細はログをご確認ください。`,
        });
      } else {
        throw new Error(data?.error || "ダイジェストメールの送信に失敗しました");
      }
    } catch (error: any) {
      console.error("Error sending digest:", error);
      toast({
        title: "ダイジェストメール送信エラー",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={handleDigestClick}
      disabled={sending}
      className="text-doshisha-purple hover:text-doshisha-purple hover:bg-purple-50"
    >
      <Mail className="w-4 h-4 mr-1" />
      {sending ? (
        <>
          <div className="w-3 h-3 border border-doshisha-purple border-t-transparent rounded-full animate-spin mr-1" />
          送信中...
        </>
      ) : (
        "digest"
      )}
    </Button>
  );
}
