
import { supabase } from './integrations/supabase/client';
import { 
  areNotificationsEnabled, 
  initializePushNotifications, 
  setupNotificationHandlers 
} from './services/notifications';

// Initialize notifications when the app starts
export const initializeNotifications = async () => {
  try {
    // Check if user is signed in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('User not authenticated, skipping notification initialization');
      return;
    }

    // Initialize Firebase
    const initialized = await initializePushNotifications();
    if (!initialized) {
      console.log('Firebase messaging could not be initialized');
      return;
    }

    // Set up notification handlers
    setupNotificationHandlers();

    // Check if notifications are already enabled
    const enabled = await areNotificationsEnabled();
    console.log('Notifications already enabled:', enabled);
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};
