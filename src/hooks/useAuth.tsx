
import { useState, useEffect, useCallback } from "react";
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
  
  // Set up auth state listener
  useEffect(() => {
    if (initialized) return; // Prevent multiple initializations
    
    console.log("Setting up auth state listener");
    
    // Track subscriptions to prevent memory leaks
    let authStateSubscription: { unsubscribe: () => void } | null = null;
    
    const setupAuth = async () => {
      try {
        // First set up auth state change listener
        const { data } = supabase.auth.onAuthStateChange(
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
        
        authStateSubscription = data.subscription;
        
        // Then check for existing session
        console.log("Getting current session...");
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);
        setUser(sessionData.session?.user || null);
        
        console.log("Initial session check complete");
        setLoading(false);
        setInitialized(true);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setLoading(false);
        setInitialized(true);
      }
    };
    
    setupAuth();
    
    // Cleanup function
    return () => {
      if (authStateSubscription) {
        authStateSubscription.unsubscribe();
      }
    };
  }, [initialized]);

  // Clear auth state on logout
  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, []);
  
  return {
    ...authOperations,
    user,
    session,
    loading,
    isAuthenticated: !!user,
    handleLogout
  };
}
