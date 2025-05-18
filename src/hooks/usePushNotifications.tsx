
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  initializePushNotifications,
  requestNotificationPermission,
  disableNotifications,
  setupNotificationHandlers,
  areNotificationsEnabled,
  isNotificationSupported,
  getNotificationPermission
} from '@/services/notifications';

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = async () => {
      try {
        // Check browser support
        const supported = isNotificationSupported();
        setIsSupported(supported);
        
        if (supported) {
          // Initialize Firebase
          await initializePushNotifications();
          
          // Set up notification handlers
          setupNotificationHandlers();
          
          // Check current permission
          setPermission(getNotificationPermission());
          
          // Check if notifications already enabled
          const enabled = await areNotificationsEnabled();
          if (enabled) {
            setPermission('granted');
          }
        }
      } catch (error) {
        console.error('Error checking push notification support:', error);
        setIsSupported(false);
      }
    };
    
    checkSupport();
  }, []);

  // Request permission and get token
  const enableNotifications = async () => {
    setLoading(true);
    
    try {
      const newToken = await requestNotificationPermission();
      if (newToken) {
        setToken(newToken);
        setPermission('granted');
        toast({
          title: "通知が有効になりました",
          description: "重要なお知らせがあるときに通知を受け取れます。",
          duration: 5000,
        });
        return true;
      } else {
        toast({
          title: "通知を有効にできませんでした",
          description: "ブラウザの設定を確認してください。",
          variant: "destructive",
          duration: 5000,
        });
        return false;
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      toast({
        title: "エラーが発生しました",
        description: "通知設定の処理中にエラーが発生しました。",
        variant: "destructive",
        duration: 5000,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Disable notifications
  const disableNotificationsForUser = async () => {
    setLoading(true);
    
    try {
      const success = await disableNotifications();
      if (success) {
        setToken(null);
        toast({
          title: "通知が無効になりました",
          description: "通知を再度有効にするには設定画面から変更できます。",
          duration: 5000,
        });
        return true;
      } else {
        toast({
          title: "通知を無効にできませんでした",
          description: "もう一度お試しください。",
          variant: "destructive",
          duration: 5000,
        });
        return false;
      }
    } catch (error) {
      console.error("Error disabling notifications:", error);
      toast({
        title: "エラーが発生しました",
        description: "通知設定の処理中にエラーが発生しました。",
        variant: "destructive",
        duration: 5000,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isSupported,
    permission,
    token,
    loading,
    enableNotifications,
    disableNotifications: disableNotificationsForUser,
  };
}
