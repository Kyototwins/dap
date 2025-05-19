
import { getMessaging, onMessage } from 'firebase/messaging';
import { toast } from '@/components/ui/use-toast';
import { getFirebaseApp } from './config';

// Set up handlers for foreground messages
export const setupNotificationHandlers = () => {
  try {
    const firebaseApp = getFirebaseApp();
    const messaging = getMessaging(firebaseApp);
    
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
