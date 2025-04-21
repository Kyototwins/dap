import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
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
      // Get current user
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        throw new Error("Failed to retrieve account information.");
      }

      // 各テーブルからデータ削除
      await supabase.from('notifications').delete().eq('user_id', user.id);
      await supabase.from('matches').delete().eq('user1_id', user.id);
      await supabase.from('matches').delete().eq('user2_id', user.id);
      await supabase.from('messages').delete().eq('sender_id', user.id);
      await supabase.from('events').delete().eq('creator_id', user.id);
      await supabase.from('event_participants').delete().eq('user_id', user.id);
      await supabase.from('event_comments').delete().eq('user_id', user.id);
      await supabase.from('offered_experiences').delete().eq('user_id', user.id);
      await supabase.from('message_group_members').delete().eq('user_id', user.id);

      // プロフィール削除（最後）
      await supabase.from('profiles').delete().eq('id', user.id);

      // service_role_keyは環境変数や安全な方法で取得する必要があるため、暫定的にwindow.prompt
      // 本番では絶対にフロントエンドに埋め込まないでください
      // 開発・検証のみでご利用ください
      const serviceRole = window.prompt("service_roleキーを入力してください(開発用途)")?.trim();
      if (!serviceRole) {
        throw new Error("管理用キー（service_role）が必要です。");
      }

      // Edge Functionでauth.usersを削除
      const fnRes = await fetch("https://yxacicvkyusnykivbmtg.functions.supabase.co/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, service_role_key: serviceRole }),
      });
      const res = await fnRes.json();
      if (!fnRes.ok || !res.success) {
        throw new Error("auth.usersの削除に失敗しました: " + (res.error || ""));
      }

      toast({
        title: "Account Deleted",
        description: "Thank you for using our service.",
      });

      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Deletion Failed",
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
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              Your account cannot be recovered after deletion.<br />
              Click "Next" to proceed with the deletion process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={() => {
                setOpenFirst(false);
                setOpenSecond(true);
              }}
            >
              Next
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openSecond} onOpenChange={setOpenSecond}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Permanently delete your account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All your data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading} onClick={() => setOpenSecond(false)}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={handleDelete}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
