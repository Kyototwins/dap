
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function DeleteAccountButton() {
  const [openFirst, setOpenFirst] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      // サインイン済みユーザー取得
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        throw new Error("アカウント情報の取得に失敗しました。");
      }
      // Supabaseのアカウント削除（ユーザー自身で自分を削除する場合）
      const { error: delError } = await supabase.auth.admin.deleteUser(user.id);
      if (delError) throw delError;

      toast({
        title: "アカウントを削除しました",
        description: "ご利用ありがとうございました。",
      });
      // ログイン画面に遷移
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "削除に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpenSecond(false);
      setOpenFirst(false);
    }
  };

  return (
    <div className="my-6 flex flex-col items-end">
      <AlertDialog open={openFirst} onOpenChange={setOpenFirst}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="rounded-xl">
            アカウントを削除
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本当にアカウントを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              アカウント削除後は復元できません。<br />
              続行する場合は「次へ」をクリックしてください。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpenFirst(false);
                setOpenSecond(true);
              }}
            >
              次へ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openSecond} onOpenChange={setOpenSecond}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              アカウントを完全に削除しますか？
            </AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。本当に削除しますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading} onClick={() => setOpenSecond(false)}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={loading}
              onClick={handleDelete}
            >
              {loading ? "削除中..." : "削除する"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

