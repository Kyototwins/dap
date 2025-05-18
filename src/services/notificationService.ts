
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
const vapidKey = "BG7TX0t1FRTlyvC1fWytvLvv_0s8qSI8YaY8Bhk3wPO7HOj8vjzTh-hRQQJiALiAlF5eqaFf1H7yOldshTLpAXA";

let messaging: any = null;
let app: any = null;

// Check if notification permissions are already granted
export const areNotificationsEnabled = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  return Notification.permission === 'granted';
};

// Initialize Firebase and set up messaging
export const initializePushNotifications = async (): Promise<boolean> => {
  try {
    if (!await isSupported()) {
      console.log('Firebase messaging is not supported in this browser');
      return false;
    }
    
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
};

// Request permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.error('Firebase messaging not initialized');
      return null;
    }
    
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }
    
    // Get token
    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      console.log('FCM token obtained:', currentToken);
      
      // Save token to user's profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ fcm_token: currentToken })
          .eq('id', user.id);
          
        if (error) {
          console.error('Error saving FCM token:', error);
        }
      }
      
      return currentToken;
    } else {
      console.log('No token available');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Set up handlers for foreground messages
export const setupNotificationHandlers = () => {
  if (!messaging) return;
  
  onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    
    // Create and display notification
    const { title, body, icon } = payload.notification || {};
    
    if (title) {
      // Show a toast notification
      const toast = useToast();
      toast.toast({
        title: title,
        description: body || '',
        duration: 5000,
      });
      
      // You can also show a browser notification
      if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, {
            body: body || '',
            icon: icon || '/favicon.ico',
            data: payload.data
          });
        });
      }
    }
  });
};

// Disable notifications and clear token
export const disableNotifications = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return false;
    }
    
    // Clear token from database
    const { error } = await supabase
      .from('profiles')
      .update({ fcm_token: null })
      .eq('id', user.id);
      
    if (error) {
      console.error('Error clearing FCM token:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error disabling notifications:', error);
    return false;
  }
};
