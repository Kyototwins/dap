
import { useState, useEffect } from "react";
import { useAuthOperations } from "./useAuthOperations";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export type { AuthFormData } from "@/types/auth";

export function useAuth() {
  const authOperations = useAuthOperations();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 認証状態のリスナーを設定（最初に実行）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // ローディング状態を更新（セッション取得後）
        if (event !== 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );
    
    // 既存のセッションを確認（1回だけ実行）
    const getCurrentSession = async () => {
      try {
        console.log("Getting current session...");
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
      } finally {
        console.log("Initial session check complete");
        setLoading(false);
      }
    };
    
    getCurrentSession();
    
    // クリーンアップ関数
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return {
    ...authOperations,
    user,
    session,
    loading
  };
}
