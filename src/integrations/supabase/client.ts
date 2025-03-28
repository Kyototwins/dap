
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yxacicvkyusnykivbmtg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4YWNpY3ZreXVzbnlraXZibXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NDY3MTYsImV4cCI6MjA1NTQyMjcxNn0.FXjSvFChIG5t23cDV5VKHEkl82Ki-pnv64PWQjcd6jQ";

// クライアント作成時のオプションを追加
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      fetch: (...args) => {
        // カスタムフェッチ関数でタイムアウトを設定
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('リクエストがタイムアウトしました。ネットワーク接続を確認してください。'));
          }, 10000); // 10秒タイムアウト

          fetch(...args)
            .then(response => {
              clearTimeout(timeoutId);
              resolve(response);
            })
            .catch(error => {
              clearTimeout(timeoutId);
              reject(error);
            });
        });
      }
    }
  }
);

// 接続テスト関数
export const testSupabaseConnection = async () => {
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('接続タイムアウト')), 5000)
    );
    
    const connectionTest = supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    // Promiseレースでタイムアウトを設定
    const result = await Promise.race([connectionTest, timeout]);
    return { success: !result.error, error: result.error };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('不明なエラーが発生しました') 
    };
  }
};

// オフライン状態かどうかを確認する関数
export const isOffline = () => {
  return !window.navigator.onLine;
};
