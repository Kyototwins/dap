
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthOperations } from "./useAuthOperations";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

export type { AuthFormData } from "@/types/auth";

export function useAuth() {
  const authOperations = useAuthOperations();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const initializingRef = useRef(false);
  
  // Set up auth state listener
  useEffect(() => {
    // Prevent multiple initializations
    if (initialized || initializingRef.current) return;
    
    initializingRef.current = true;
    console.log("Setting up auth state listener");
    
    // First set up auth state change listener for future changes
    const { data } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event, "User present:", !!currentSession?.user);
      
      if (event === 'SIGNED_OUT') {
        // Clear state on sign out
        console.log("User signed out, clearing state");
        setUser(null);
        setSession(null);
      } else if (currentSession) {
        // Update state with new session
        console.log("Session updated, user ID:", currentSession.user.id);
        setSession(currentSession);
        setUser(currentSession.user);
      }
    });
    
    // Then check for existing session
    const setupAuth = async () => {
      try {
        console.log("Getting current session...");
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setLoading(false);
          setInitialized(true);
          initializingRef.current = false;
          return;
        }
        
        console.log("Initial session check complete, session exists:", !!sessionData?.session);
        if (sessionData?.session?.user) {
          console.log("User data:", sessionData.session.user.id);
        }
        
        // Set session and user state
        setSession(sessionData.session);
        setUser(sessionData.session?.user || null);
        
        setLoading(false);
        setInitialized(true);
        initializingRef.current = false;
      } catch (error) {
        console.error("Auth initialization error:", error);
        setLoading(false);
        setInitialized(true);
        initializingRef.current = false;
      }
    };
    
    setupAuth();
    
    return () => {
      data.subscription.unsubscribe();
    };
  }, [initialized]);

  // Clear auth state on logout
  const handleLogout = useCallback(async () => {
    try {
      console.log("Logging out user");
      setLoading(true);
      
      // Sign out the user
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during logout:", error);
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("User logged out successfully");
      // State is updated through onAuthStateChange
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
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
