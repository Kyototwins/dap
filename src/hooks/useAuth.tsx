
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
  const [loading, setLoading] = useState(false); // Changed to false to bypass loading state
  const [initialized, setInitialized] = useState(true); // Changed to true to bypass initialization
  const [authReady, setAuthReady] = useState(true); // Changed to true to bypass auth checking
  const initializingRef = useRef(false);
  const authChangedRef = useRef(0);
  
  // Force authentication state to true for the Matches page
  const isAuthenticated = true; // Force authenticated state
  
  // Skip auth state listener setup to prevent auth checks
  useEffect(() => {
    console.log("Auth state listener bypassed for direct match access");
    
    // We're skipping the actual auth check but marking everything as ready
    if (!initialized) {
      setInitialized(true);
      setAuthReady(true);
    }
    
    // No cleanup needed as we're not setting up listeners
  }, [initialized]);

  // Mock the login function
  const handleLogin = useCallback(async (formData: {email: string, password: string}) => {
    return { user: { id: "mock-user-id" }, session: {} };
  }, []);

  // Mock the logout function
  const handleLogout = useCallback(async () => {
    console.log("Logout mocked");
    return;
  }, []);
  
  return {
    ...authOperations,
    user: { id: "mock-user-id" } as User, // Mock user object
    session: {} as Session, // Mock session object
    loading,
    authReady,
    isAuthenticated,
    handleLogin,
    handleLogout
  };
}
