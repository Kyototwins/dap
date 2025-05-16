
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
        // First check for existing session to avoid unnecessary flickering
        console.log("Getting current session...");
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setLoading(false);
          setInitialized(true);
          return;
        }
        
        // Set initial session and user state
        console.log("Initial session check complete, user:", !!sessionData?.session?.user);
        
        // Important: Set both session and user atomically to prevent UI flickers
        setSession(sessionData.session);
        setUser(sessionData.session?.user || null);
        
        // Then set up auth state change listener for future changes
        const { data } = supabase.auth.onAuthStateChange((event, currentSession) => {
          console.log("Auth state changed:", event, "User present:", !!currentSession?.user);
          
          if (event === 'SIGNED_OUT') {
            // Clear state on sign out
            setUser(null);
            setSession(null);
          } else if (currentSession) {
            // Update state with new session
            setSession(currentSession);
            setUser(currentSession.user);
          }
          
          // Only update loading for events after initial setup
          if (event !== 'INITIAL_SESSION') {
            setLoading(false);
          }
        });
        
        authStateSubscription = data.subscription;
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
      console.log("Logging out user");
      setLoading(true);
      await supabase.auth.signOut();
      // Note: State is updated through onAuthStateChange
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
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
