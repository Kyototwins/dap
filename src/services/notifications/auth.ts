
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Auth関連の通知を処理するユーティリティ
 */
export const authNotifications = {
  /**
   * メール確認のステータスを確認
   * @returns 確認ステータス
   */
  async checkEmailConfirmation(userId: string) {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Error checking email confirmation:", error);
        return false;
      }
      
      if (!data.user) {
        return false;
      }
      
      return data.user.email_confirmed_at !== null;
    } catch (error) {
      console.error("Error in checkEmailConfirmation:", error);
      return false;
    }
  },
  
  /**
   * 確認メールの再送信
   * @param email ユーザーのメールアドレス
   */
  async resendConfirmationEmail(email: string) {
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: window.location.origin + '/login',
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "確認メールを再送信しました",
        description: "メールをご確認ください。届かない場合はスパムフォルダも確認してください。",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error resending confirmation email:", error);
      
      toast({
        title: "エラーが発生しました",
        description: error.message || "確認メールの再送信に失敗しました。",
        variant: "destructive",
      });
      
      return false;
    }
  }
};

