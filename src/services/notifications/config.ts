
import { initializeApp } from 'firebase/app';

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyA0CGdXZqYcgzl1_JO5IyRV1-3z8xKjlHc",
  authDomain: "globalpals-1e1c5.firebaseapp.com",
  projectId: "globalpals-1e1c5",
  storageBucket: "globalpals-1e1c5.appspot.com",
  messagingSenderId: "859906895842",
  appId: "1:859906895842:web:26eed2319c9f36d36354dc"
};

// VAPID key for web push notifications
export const vapidKey = 'BKAgTyX0SJFWDDGcr5VRoDQbJEClt0YwUiajG2r-Oe8MP8q2JqyI6NMXcF4FxVJMhU8lLwWHr6YZFFaRZuE8-Vs';

// Create a singleton for Firebase app instance
let firebaseAppInstance: any = null;

// Get Firebase app instance
export const getFirebaseApp = () => {
  if (!firebaseAppInstance) {
    firebaseAppInstance = initializeApp(firebaseConfig);
  }
  return firebaseAppInstance;
};
