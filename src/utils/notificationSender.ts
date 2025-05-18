
import { supabase } from '@/integrations/supabase/client';

/**
 * これはサーバーサイドで使用する関数例です。
 * 実際の使用時には、Edge FunctionなどのサーバーサイドJSファイルとして実装してください。
 */

// FCMトークンに通知を送信
export async function sendFCMNotification(fcmToken: string, title: string, body: string, data: any = {}) {
  const FCM_SERVER_KEY = "AAAAeguHA5Y:APA91bGirYo0jSKqiGac3YgYmJWrhWBqUfJqXzTxjQLj95XR_QnZUHNcDnTYZLWNQO3O_-9ojQjRhwK-2KAD9y0wExYFzegPRcIXlsjMjCaOn7Lz9ESIpdFiMafJd3lXnj1_yiY3uNYa";
  
  const message = {
    to: fcmToken,
    notification: {
      title,
      body,
      icon: '/favicon.ico',
      click_action: 'https://yourdomain.com', // アプリがホストされているURL
    },
    data,
  };
  
  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${FCM_SERVER_KEY}`,
      },
      body: JSON.stringify(message),
    });
    
    const responseData = await response.json();
    console.log('FCM Response:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error sending FCM notification:', error);
    throw error;
  }
}

/**
 * カールコマンドの例:
 * 
 * curl -X POST \
 * 'https://fcm.googleapis.com/fcm/send' \
 * -H 'Authorization: key=AAAAeguHA5Y:APA91bGirYo0jSKqiGac3YgYmJWrhWBqUfJqXzTxjQLj95XR_QnZUHNcDnTYZLWNQO3O_-9ojQjRhwK-2KAD9y0wExYFzegPRcIXlsjMjCaOn7Lz9ESIpdFiMafJd3lXnj1_yiY3uNYa' \
 * -H 'Content-Type: application/json' \
 * -d '{
 *   "to": "FCMトークンをここに入力",
 *   "notification": {
 *     "title": "新しいメッセージ",
 *     "body": "Aさんからメッセージが届きました",
 *     "icon": "/favicon.ico",
 *     "click_action": "https://yourdomain.com"
 *   },
 *   "data": {
 *     "type": "new_message",
 *     "sender_id": "送信者ID",
 *     "url": "/messages"
 *   }
 * }'
 */

/**
 * 通常、通知は以下の方法で送信されます:
 * 
 * 1. ユーザーに関連するイベントが発生 (新しいメッセージなど)
 * 2. データベースのトリガーが起動
 * 3. Edge FunctionがFCMトークンを取得し、上記のように通知を送信
 * 
 * 例: ユーザーがメッセージを受信したときの通知送信例
 */
export async function sendMessageNotification(recipientId: string, senderId: string, messagePreview: string) {
  // 1. FCMトークンを取得
  const { data, error } = await supabase
    .from('profiles')
    .select('first_name, fcm_token')
    .eq('id', recipientId)
    .single();
  
  if (error || !data || !data.fcm_token) {
    console.error('FCMトークンが見つかりません:', error);
    return false;
  }
  
  // 2. 送信者の名前を取得
  const { data: senderData, error: senderError } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', senderId)
    .single();
  
  if (senderError || !senderData) {
    console.error('送信者の情報が見つかりません:', senderError);
    return false;
  }
  
  // 3. 通知を送信
  const senderName = `${senderData.first_name || ''} ${senderData.last_name || ''}`.trim();
  const title = '新しいメッセージ';
  const body = `${senderName}さんからメッセージが届きました: ${messagePreview}`;
  
  // 通知データ
  const notificationData = {
    type: 'new_message',
    sender_id: senderId,
    url: '/messages'
  };
  
  // FCM通知を送信
  return sendFCMNotification(data.fcm_token, title, body, notificationData);
}
