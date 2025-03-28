
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
  }
);

// 接続テスト関数
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    return { success: !error, error };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, error };
  }
};
