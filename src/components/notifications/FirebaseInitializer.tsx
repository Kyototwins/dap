
import { useEffect } from 'react';
import { initializePushNotifications, areNotificationsEnabled, setupNotificationHandlers } from '@/services/notificationService';

export function FirebaseInitializer() {
  // Initialize Firebase when the component mounts
  useEffect(() => {
    const initializeFirebase = async () => {
      // Initialize Firebase messaging
      const initialized = await initializePushNotifications();
      
      if (initialized) {
        // Set up handlers for foreground messages
        setupNotificationHandlers();
        
        // Check if notifications are already enabled
        const enabled = await areNotificationsEnabled();
        console.log('Notifications enabled:', enabled);
      }
    };
    
    initializeFirebase();
  }, []);
  
  // This is a silent component with no UI
  return null;
}
