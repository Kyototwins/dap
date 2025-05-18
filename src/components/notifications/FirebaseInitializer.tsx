
import { useEffect } from 'react';
import { 
  initializePushNotifications,
  areNotificationsEnabled, 
  setupNotificationHandlers 
} from '@/services/notifications';

export function FirebaseInitializer() {
  // Initialize Firebase when the component mounts
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Initialize Firebase messaging
        const initialized = await initializePushNotifications();
        
        if (initialized) {
          // Set up handlers for foreground messages
          setupNotificationHandlers();
          
          // Check if notifications are already enabled
          const enabled = await areNotificationsEnabled();
          console.log('Notifications enabled:', enabled);
        }
      } catch (error) {
        console.error('Failed to initialize Firebase:', error);
      }
    };
    
    initializeFirebase();
  }, []);
  
  // This is a silent component with no UI
  return null;
}
