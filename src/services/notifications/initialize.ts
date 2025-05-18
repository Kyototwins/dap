
import { getMessaging } from 'firebase/messaging';
import { getFirebaseApp } from './config';

// Initialize Firebase App and check for support
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
    
    // Initialize Firebase
    const firebaseApp = getFirebaseApp();
    const messaging = getMessaging(firebaseApp);
    console.log('Firebase initialized successfully');
    
    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
};

// Check if browser supports notifications
export const isNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

// Get current notification permission
export const getNotificationPermission = (): NotificationPermission => {
  return Notification.permission;
};
