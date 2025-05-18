
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { requestNotificationPermission } from "@/services/notificationService";

// Firebase初期化と通知許可を統合するコンポーネント
export function FirebaseInitializer() {
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Firebaseの初期化
    const initFirebase = async () => {
      try {
        // 既にwindow.firebaseが存在する場合は初期化済み
        if (window.firebase) {
          setInitialized(true);
          return;
        }

        // Firebaseを動的にロード
        const firebaseApp = await import('firebase/app');
        const firebaseMessaging = await import('firebase/messaging');
        
        // Firebaseが初期化済みでない場合のみ初期化
        if (!firebaseApp.getApps().length) {
          firebaseApp.initializeApp({
            apiKey: "AIzaSyD4kXQ6AyVWwElO5c5WfTzA5Jc9ant0A_Y",
            authDomain: "dap-app-381512.firebaseapp.com",
            projectId: "dap-app-381512",
            storageBucket: "dap-app-381512.appspot.com",
            messagingSenderId: "503754515700",
            appId: "1:503754515700:web:5cb193affa53a72820b592"
          });
          
          // windowにfirebaseオブジェクトを割り当て
          window.firebase = {
            app: firebaseApp,
            messaging: () => firebaseMessaging.getMessaging()
          };
          
          console.log("Firebase初期化完了");
          setInitialized(true);
          
          // Service Workerの登録
          registerServiceWorker();
        }
      } catch (error) {
        console.error("Firebase初期化エラー:", error);
      }
    };

    initFirebase();
  }, []);

  // Service Workerの登録
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker登録完了:', registration);
      } catch (error) {
        console.error('Service Worker登録エラー:', error);
      }
    }
  };

  // 通知許可の要求と処理
  const handleRequestNotification = async () => {
    try {
      const token = await requestNotificationPermission();
      
      if (token) {
        toast({
          title: "通知が有効になりました",
          description: "新しいメッセージが届いたときに通知を受け取ります",
          variant: "default",
        });
      } else {
        toast({
          title: "通知が許可されていません",
          description: "通知を受け取るにはブラウザの設定で許可してください",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("通知許可処理エラー:", error);
      toast({
        title: "エラー",
        description: "通知の設定に失敗しました",
        variant: "destructive",
      });
    }
  };

  // インターフェース宣言
  return null; // UI要素なし、バックグラウンドで動作
}
