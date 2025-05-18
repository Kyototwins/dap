
import { supabase } from "@/integrations/supabase/client";
import { messaging, requestNotificationPermission, setupForegroundMessageHandler, saveFcmTokenToProfile } from '@/integrations/firebase/client';

// Function to send a push notification
export const sendPushNotification = async (
  fcmToken: string,
  title: string,
  body: string,
  data?: any
) => {
  const message = {
    to: fcmToken,
    notification: {
      title,
      body,
    },
    data: data,
  };

  try {
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY}`,
      },
      body: JSON.stringify(message),
    });

    const responseData = await response.json();
    console.log("FCM Response:", responseData);

    if (responseData.failure > 0) {
      console.error("FCM Error:", responseData.results);
      return { error: "Failed to send push notification" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { error };
  }
};

// Update FCM token in user profile
export const updateFcmToken = async (token: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase
      .from("profiles")
      .update({ fcm_token: token })
      .eq("id", user.id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating FCM token:", error);
    return { error };
  }
};

// Get FCM token from user profile
export const getFcmToken = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("fcm_token")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return { token: data?.fcm_token || null };
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return { error };
  }
};

// Check if notifications are enabled
export const areNotificationsEnabled = (): boolean => {
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    return false;
  }
  
  // Check permission status
  if (Notification.permission !== 'granted') {
    return false;
  }
  
  // Check if FCM token exists in localStorage
  const fcmToken = localStorage.getItem('fcmToken');
  return !!fcmToken;
};

// Initialize push notifications
export const initializePushNotifications = async (): Promise<boolean> => {
  try {
    // Check if browser supports notifications
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.log('Push notifications not supported');
      return false;
    }
    
    // Request notification permission and get FCM token
    const token = await requestNotificationPermission();
    if (!token) {
      console.log('Failed to get notification token');
      return false;
    }
    
    // Save token to user profile
    const result = await saveFcmTokenToProfile(token);
    if (!result) {
      console.log('Failed to save token to profile');
      return false;
    }
    
    console.log('Push notifications initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return false;
  }
};

// Set up notification handlers for foreground messages
export const setupNotificationHandlers = (): void => {
  setupForegroundMessageHandler((payload) => {
    // Display notification when app is in foreground
    const title = payload.notification?.title || 'New Notification';
    const body = payload.notification?.body || 'You have a new notification';
    
    // Use browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: '/favicon.ico'
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  });
};
