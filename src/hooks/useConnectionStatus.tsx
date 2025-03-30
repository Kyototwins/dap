
import { useState, useEffect } from "react";
import { isOffline, testSupabaseConnection } from "@/integrations/supabase/client";

export function useConnectionStatus() {
  const [connectionError, setConnectionError] = useState(false);
  const [offline, setOffline] = useState(false);

  // オンライン状態の監視
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    setOffline(isOffline());

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  // ページ読み込み時に接続テスト
  useEffect(() => {
    const checkConnection = async () => {
      if (!offline) {
        try {
          const { success } = await testSupabaseConnection();
          setConnectionError(!success);
        } catch (error) {
          setConnectionError(true);
        }
      }
    };
    checkConnection();
  }, [offline]);

  const testConnection = async () => {
    if (offline) {
      return false;
    }
    
    try {
      const { success } = await testSupabaseConnection();
      if (!success) {
        console.error("Supabase connection error");
        setConnectionError(true);
        return false;
      }
      setConnectionError(false);
      return true;
    } catch (error) {
      console.error("Connection test failed:", error);
      setConnectionError(true);
      return false;
    }
  };

  return {
    connectionError,
    offline,
    testConnection
  };
}
