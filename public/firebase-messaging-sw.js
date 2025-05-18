
// Firebase Cloud Messaging Service Worker

importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA0CGdXZqYcgzl1_JO5IyRV1-3z8xKjlHc",
  authDomain: "globalpals-1e1c5.firebaseapp.com",
  projectId: "globalpals-1e1c5",
  storageBucket: "globalpals-1e1c5.appspot.com",
  messagingSenderId: "859906895842",
  appId: "1:859906895842:web:26eed2319c9f36d36354dc"
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const { title, body, icon } = payload.notification || {};
  
  if (title) {
    self.registration.showNotification(title, {
      body: body || '',
      icon: icon || '/favicon.ico',
      data: payload.data
    });
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  // Close notification
  event.notification.close();
  
  // Get data from notification
  const clickData = event.notification.data;
  
  // Default URL to open
  let urlToOpen = '/';
  
  // Check for specific URL in data
  if (clickData && clickData.url) {
    urlToOpen = clickData.url;
  } else if (clickData && clickData.type) {
    // Handle different notification types
    switch (clickData.type) {
      case 'new_message':
        urlToOpen = '/messages';
        break;
      case 'new_match':
        urlToOpen = '/matches';
        break;
      case 'new_event':
        urlToOpen = '/events';
        break;
      default:
        urlToOpen = '/';
    }
  }
  
  // Open URL
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
