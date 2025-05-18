
import { areNotificationsEnabled, initializePushNotifications, setupNotificationHandlers } from "./services/notificationService";

// Initialize notifications on app startup if previously enabled
export async function initializeNotificationsIfNeeded() {
  try {
    // Check if browser supports notifications
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      return false;
    }
    
    // Check if notifications are already enabled
    const enabled = areNotificationsEnabled();
    if (!enabled) {
      return false;
    }
    
    // Initialize notifications
    await initializePushNotifications();
    setupNotificationHandlers();
    
    return true;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return false;
  }
}
