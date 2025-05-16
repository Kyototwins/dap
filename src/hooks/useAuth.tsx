
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
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    if (initialized) return; // Prevent multiple initializations
    
    console.log("Setting up auth state listener");
    
    // First set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, Boolean(currentSession));
        
        // Update session state
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Only update loading for events after initial setup
        if (event !== 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );
    
    // Then check for existing session
    const getCurrentSession = async () => {
      try {
        console.log("Getting current session...");
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
      } finally {
        console.log("Initial session check complete");
        setLoading(false);
        setInitialized(true);
      }
    };
    
    getCurrentSession();
    
    // Cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, [initialized]);
  
  return {
    ...authOperations,
    user,
    session,
    loading,
    isAuthenticated: !!user
  };
}
