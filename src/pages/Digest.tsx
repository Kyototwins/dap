
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";
import { useState } from "react";

export default function Digest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user || user.email !== "takerinauni@gmail.com") {
      console.log("Redirecting to /matches because user is not authorized");
      navigate("/matches");
    }
  }, [user, navigate]);

  const handleSendDigest = async () => {
    try {
      setSending(true);
      
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

  if (!user || user.email !== "takerinauni@gmail.com") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Mail className="w-6 h-6 text-doshisha-purple" />
        <h1 className="text-2xl font-bold">ダイジェスト通知</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              ダイジェスト通知送信
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              メール通知を有効にしているすべてのユーザーに前日のアクティビティダイジェストを送信します。
              昨日のアクティビティサマリーが対象ユーザーに送信されます。
            </p>
            <Button 
              onClick={handleSendDigest}
              disabled={sending}
              className="w-full sm:w-auto"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ダイジェスト送信中...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  全員にダイジェスト通知を送信
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
