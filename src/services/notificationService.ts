
import { toast } from "@/components/ui/use-toast";
import { 
  requestNotificationPermission, 
  setupForegroundMessageHandler,
  saveFcmTokenToProfile
} from "@/integrations/firebase/client";

/**
 * Initialize push notifications
 */
export async function initializePushNotifications(): Promise<boolean> {
  try {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported in this browser');
      return false;
    }

    // Check if notification API is supported
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    // Register service worker
    await registerServiceWorker();

    // Request permission and get token
    const token = await requestNotificationPermission();
    if (!token) {
      return false;
    }

    // Save token to user profile
    const saved = await saveFcmTokenToProfile(token);
    if (saved) {
      console.log('FCM token saved successfully');
    }

    return true;
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return false;
  }
}

/**
 * Register the FCM service worker
 */
async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    console.log('Service Worker registered with scope:', registration.scope);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Set up notification handlers
 */
export function setupNotificationHandlers() {
  // Handle foreground messages
  setupForegroundMessageHandler((payload) => {
    // Show toast for foreground messages
    toast({
      title: payload.notification?.title || 'New Notification',
      description: payload.notification?.body || 'You have received a new notification',
      duration: 5000,
    });
  });
}

/**
 * Check if notifications are enabled
 */
export function areNotificationsEnabled(): boolean {
  return Notification.permission === 'granted';
}

