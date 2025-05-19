
import { getMessaging, getToken } from 'firebase/messaging';
import { supabase } from '@/integrations/supabase/client';
import { getFirebaseApp } from './config';
import { vapidKey } from './config';

// Request permission and get token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const firebaseApp = getFirebaseApp();
      const messaging = getMessaging(firebaseApp);
      
      // Get token
      const currentToken = await getToken(messaging, { vapidKey });
      
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        
        // Save token to user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          try {
            const { error } = await supabase
              .from('profiles')
              .update({ fcm_token: currentToken })
              .eq('id', user.id);
              
            if (error) {
              console.error('Error saving FCM token:', error);
            }
          } catch (err) {
            console.error('Error in updating profile with FCM token:', err);
          }
        }
        
        return currentToken;
      } else {
        console.log('No registration token available');
        return null;
      }
    } else {
      console.log('Permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Check if notifications are already enabled
export const areNotificationsEnabled = async () => {
  try {
    // Check permission status
    if (Notification.permission !== 'granted') return false;
    
    // Check if we have a token
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('fcm_token')
        .eq('id', user.id)
        .single();
        
      // Check if data exists and has the fcm_token property
      return !!(data && data.fcm_token);
    } catch (err) {
      console.error('Error checking notification status:', err);
      return false;
    }
  } catch (error) {
    console.error('Error checking notification status:', error);
    return false;
  }
};

// Disable notifications
export const disableNotifications = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ fcm_token: null })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error removing FCM token:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error in disabling notifications:', err);
      return false;
    }
  } catch (error) {
    console.error('Error disabling notifications:', error);
    return false;
  }
};
