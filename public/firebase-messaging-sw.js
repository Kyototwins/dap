
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// Firebase設定を更新
firebase.initializeApp({
  apiKey: "AIzaSyA4dih3MNnbZjT6e_lFzLl2Z2JWuyOfD44",
  authDomain: "dapapp-8bb6b.firebaseapp.com",
  projectId: "dapapp-8bb6b",
  storageBucket: "dapapp-8bb6b.firebasestorage.app",
  messagingSenderId: "164708307109",
  appId: "1:164708307109:web:c1552c3e19711eb0ce7d4c",
  measurementId: "G-C1E87FSZE2"
});

const messaging = firebase.messaging();

// 背景メッセージの処理
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data,
    // 必要に応じてアクションを追加
    actions: [
      {
        action: 'view',
        title: 'View'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 通知クリックのハンドリング
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // 同じウィンドウが既に開いているかを確認して、フォーカスする
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // 対象URLで既に開いているウィンドウ/タブがあるか確認
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          // あれば、フォーカス
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // なければ、新しいウィンドウ/タブを開く
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});
