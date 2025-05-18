
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD4kXQ6AyVWwElO5c5WfTzA5Jc9ant0A_Y",
  authDomain: "dap-app-381512.firebaseapp.com",
  projectId: "dap-app-381512",
  storageBucket: "dap-app-381512.appspot.com",
  messagingSenderId: "503754515700",
  appId: "1:503754515700:web:5cb193affa53a72820b592"
});

const messaging = firebase.messaging();

// バックグラウンドでのメッセージ処理
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] 受信したバックグラウンド通知:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 通知クリック時の処理
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // URLを開く（デフォルトは /messages）
  const urlToOpen = new URL('/messages', self.location.origin).href;
  
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    // 既に開いているウィンドウがあればフォーカス
    for (let i = 0; i < windowClients.length; i++) {
      const client = windowClients[i];
      if (client.url === urlToOpen && 'focus' in client) {
        return client.focus();
      }
    }
    // なければ新しいウィンドウを開く
    if (clients.openWindow) {
      return clients.openWindow(urlToOpen);
    }
  });
  
  event.waitUntil(promiseChain);
});
