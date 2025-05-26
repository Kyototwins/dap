
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Mail, Users } from "lucide-react";
import { useState } from "react";

export default function Admin() {
  const { isAdmin, loading, role } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  console.log("Admin component - isAdmin:", isAdmin, "loading:", loading, "role:", role);

  useEffect(() => {
    console.log("Admin useEffect - loading:", loading, "isAdmin:", isAdmin);
    if (!loading && !isAdmin) {
      console.log("Redirecting to /matches because user is not admin");
      navigate("/matches");
    }
  }, [isAdmin, loading, navigate]);

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

  if (loading) {
    console.log("Admin page showing loading state");
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!isAdmin) {
    console.log("Admin page - user is not admin, returning null");
    return null;
  }

  console.log("Admin page - rendering admin dashboard");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-doshisha-purple" />
        <h1 className="text-2xl font-bold">管理者ダッシュボード</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              メール通知
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
                  ダイジェスト通知を送信
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              ユーザー管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              ユーザー管理機能は今後のアップデートで利用可能になります。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
