
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthOperations } from "./useAuthOperations";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

export type { AuthFormData } from "@/types/auth";

export function useAuth() {
  const authOperations = useAuthOperations();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const initializingRef = useRef(false);
  const authChangedRef = useRef(0);
  
  // Set up auth state listener
  useEffect(() => {
    // Prevent multiple initializations
    if (initialized || initializingRef.current) return;
    
    initializingRef.current = true;
    console.log("Setting up auth state listener");
    
    // First set up auth state change listener for future changes
    const { data } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event, "User present:", !!currentSession?.user);
      authChangedRef.current += 1;
      
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
          finishSetup();
          return;
        }
        
        console.log("Initial session check complete, session exists:", !!sessionData?.session);
        if (sessionData?.session?.user) {
          console.log("User data:", sessionData.session.user.id);
        }
        
        // Set session and user state
        setSession(sessionData.session);
        setUser(sessionData.session?.user || null);
        
        finishSetup();
      } catch (error) {
        console.error("Auth initialization error:", error);
        finishSetup();
      }
    };
    
    const finishSetup = () => {
      // Set auth ready state after a short delay to ensure state updates have propagated
      setTimeout(() => {
        setLoading(false);
        setInitialized(true);
        setAuthReady(true);
        initializingRef.current = false;
      }, 200); // Increased to 200ms for more reliable state updates
    };
    
    setupAuth();
    
    return () => {
      data.subscription.unsubscribe();
    };
  }, [initialized]);

  // Handle login with better state management
  const handleLogin = useCallback(async (formData: {email: string, password: string}) => {
    try {
      setLoading(true);
      const result = await authOperations.handleLogin(formData);
      
      // Update state immediately after successful login to prevent redirect loops
      if (result?.session && result?.user) {
        setSession(result.session);
        setUser(result.user);
        
        // Add debug information
        console.log("Login successful, updated auth state:", {
          user: result.user.id,
          session: !!result.session,
        });
      }
      
      return result;
    } catch (error) {
      console.error("Login error in useAuth:", error);
      throw error; // Re-throw to let Login component handle UI feedback
    } finally {
      setLoading(false);
    }
  }, [authOperations]);

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
          title: "ログアウトに失敗しました",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      // Clear state immediately to prevent any race conditions
      setUser(null);
      setSession(null);
      
      console.log("User logged out successfully");
      
      // Success toast
      toast({
        title: "ログアウト成功",
        description: "ログイン画面に移動します...",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Simple, direct check for authentication status
  const isAuthenticated = Boolean(user && session);
  
  return {
    ...authOperations,
    user,
    session,
    loading,
    authReady,
    isAuthenticated,
    handleLogin,
    handleLogout
  };
}
