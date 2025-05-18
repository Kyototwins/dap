
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseConfig, vapidKey } from "./config";
import { updateFcmToken } from "@/services/profileService";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get messaging instance
export const messaging = getMessaging(app);

/**
 * Request permission and get FCM token
 */
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }
    
    // Get FCM token using the VAPID key
    const token = await getToken(messaging, { vapidKey });
    if (!token) {
      console.log('No registration token available');
      return null;
    }
    
    console.log('FCM Token:', token);
    
    // Save the token to localStorage for future use
    localStorage.setItem('fcmToken', token);
    
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

/**
 * Set up foreground message handler
 * @param callback Function to handle incoming messages
 */
export function setupForegroundMessageHandler(
  callback: (payload: any) => void
): () => void {
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    callback(payload);
  });
  
  return unsubscribe;
}

/**
 * Save FCM token to user profile in Supabase
 */
export async function saveFcmTokenToProfile(token: string): Promise<boolean> {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('User not authenticated');
      return false;
    }
    
    // Use the updateFcmToken service function instead of direct Supabase call
    const success = await updateFcmToken(user.id, token);
    return success;
  } catch (error) {
    console.error('Error saving FCM token to profile:', error);
    return false;
  }
}
