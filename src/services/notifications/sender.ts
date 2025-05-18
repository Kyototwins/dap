
import { supabase } from '@/integrations/supabase/client';

/**
 * These functions are examples for server-side notification sending
 * In a production app, these would be implemented in Edge Functions or server endpoints
 */

// FCM token notification sender
export async function sendFCMNotification(fcmToken: string, title: string, body: string, data: any = {}) {
  const FCM_SERVER_KEY = "AAAAeguHA5Y:APA91bGirYo0jSKqiGac3YgYmJWrhWBqUfJqXzTxjQLj95XR_QnZUHNcDnTYZLWNQO3O_-9ojQjRhwK-2KAD9y0wExYFzegPRcIXlsjMjCaOn7Lz9ESIpdFiMafJd3lXnj1_yiY3uNYa";
  
  const message = {
    to: fcmToken,
    notification: {
      title,
      body,
      icon: '/favicon.ico',
      click_action: 'https://yourdomain.com', // App's hosted URL
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

// Message notification example
export async function sendMessageNotification(recipientId: string, senderId: string, messagePreview: string) {
  // 1. Get FCM token
  const { data, error } = await supabase
    .from('profiles')
    .select('first_name, fcm_token')
    .eq('id', recipientId)
    .single();
  
  if (error || !data || !data.fcm_token) {
    console.error('FCM token not found:', error);
    return false;
  }
  
  // 2. Get sender info
  const { data: senderData, error: senderError } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', senderId)
    .single();
  
  if (senderError || !senderData) {
    console.error('Sender info not found:', senderError);
    return false;
  }
  
  // 3. Send notification
  const senderName = `${senderData.first_name || ''} ${senderData.last_name || ''}`.trim();
  const title = '新しいメッセージ';
  const body = `${senderName}さんからメッセージが届きました: ${messagePreview}`;
  
  // Notification data
  const notificationData = {
    type: 'new_message',
    sender_id: senderId,
    url: '/messages'
  };
  
  // Send FCM notification
  return sendFCMNotification(data.fcm_token, title, body, notificationData);
}
