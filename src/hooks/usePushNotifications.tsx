
import { useState, useEffect } from 'react';
import { 
  initializePushNotifications, 
  setupNotificationHandlers,
  areNotificationsEnabled
} from '@/services/notificationService';

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

  // Check if notifications are supported and enabled
  useEffect(() => {
    // Check if the browser supports notifications
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);
    
    // Check if notifications are already enabled
    if (supported) {
      setIsEnabled(areNotificationsEnabled());
    }
  }, []);

  // Initialize notifications
  const initializeNotifications = async () => {
    try {
      setIsInitializing(true);
      const success = await initializePushNotifications();
      if (success) {
        setIsEnabled(true);
        setupNotificationHandlers();
      }
      setIsInitializing(false);
      return success;
    } catch (error) {
      setIsInitializing(false);
      console.error('Error initializing notifications:', error);
      return false;
    }
  };

  return {
    isSupported,
    isEnabled,
    isInitializing,
    initializeNotifications
  };
}

