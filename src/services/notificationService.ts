
import { supabase } from "@/integrations/supabase/client";

/**
 * FCM (Firebase Cloud Messaging) サービス関数
 */

// FCMトークンを保存/更新する
export async function saveFcmToken(token: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("認証されていません");
    
    const { error } = await supabase
      .from('profiles')
      .update({ fcm_token: token })
      .eq('id', user.id);
      
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error("FCMトークン保存エラー:", error);
    throw error;
  }
}

// ユーザーに通知権限をリクエストしFCMトークンを取得する
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    // Firebase未初期化の場合は早期リターン
    if (typeof window === 'undefined' || !window.firebase) {
      console.log("Firebase/FCMが初期化されていません");
      return null;
    }
    
    // 通知の許可をリクエスト
    const permission = await Notification.requestPermission();
    
    if (permission !== "granted") {
      console.log("通知の権限が許可されていません");
      return null;
    }
    
    try {
      // FCM準備後にトークン取得
      const messaging = window.firebase.messaging();
      const token = await messaging.getToken();
      
      if (token) {
        console.log("FCMトークンを取得しました:", token);
        await saveFcmToken(token);
        return token;
      }
    } catch (err) {
      console.error("トークン取得エラー:", err);
    }
    
    return null;
  } catch (error) {
    console.error("通知許可リクエストエラー:", error);
    return null;
  }
}
