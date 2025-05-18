import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0CGdXZqYcgzl1_JO5IyRV1-3z8xKjlHc",
  authDomain: "globalpals-1e1c5.firebaseapp.com",
  projectId: "globalpals-1e1c5",
  storageBucket: "globalpals-1e1c5.appspot.com",
  messagingSenderId: "859906895842",
  appId: "1:859906895842:web:26eed2319c9f36d36354dc"
};

// VAPID key for web push notifications
const vapidKey = 'BKAgTyX0SJFWDDGcr5VRoDQbJEClt0YwUiajG2r-Oe8MP8q2JqyI6NMXcF4FxVJMhU8lLwWHr6YZFFaRZuE8-Vs';

let firebaseApp: any = null;
let messaging: any = null;

// Initialize Firebase App
export const initializePushNotifications = async () => {
  try {
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers are not supported');
      return false;
    }
    
    if (!('Notification' in window)) {
      console.log('Notifications are not supported');
      return false;
    }
    
    // Initialize Firebase if not already initialized
    if (!firebaseApp) {
      firebaseApp = initializeApp(firebaseConfig);
      messaging = getMessaging(firebaseApp);
      console.log('Firebase initialized successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
};

// Request permission and get token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Get token
      const currentToken = await getToken(messaging, { vapidKey });
      
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        
        // Save token to user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          try {
            const { data, error } = await supabase
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
    if (!messaging) return false;
    
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
        
      // Check if data exists and has the fcm_token property or field
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

// Set up handlers for foreground messages
export const setupNotificationHandlers = () => {
  try {
    if (!messaging) return;
    
    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      
      const { notification } = payload;
      
      if (notification) {
        toast({
          title: notification.title || 'New notification',
          description: notification.body,
          duration: 5000,
        });
      }
    });
    
    console.log('Notification handlers set up');
  } catch (error) {
    console.error('Error setting up notification handlers:', error);
  }
};

// Send a test notification (for development)
export const sendTestNotification = async () => {
  // This function would call your server endpoint that sends notifications
  console.log('Sending test notification...');
  
  // In a production app, you would have an API endpoint that handles this
  // For now, we'll just show a toast as a simulation
  toast({
    title: 'Test Notification',
    description: 'This is a test notification. In a real scenario, this would be sent from your server.',
    duration: 5000,
  });
};
