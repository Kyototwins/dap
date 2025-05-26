
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type UserRole = 'admin' | 'moderator' | 'user';

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      console.log("fetchUserRole called with user:", user?.id);
      
      if (!user) {
        console.log("No user found, setting role to null");
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching user role for user ID:", user.id);
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error("Error fetching user role:", error);
        }

        console.log("User role data received:", data);
        const userRole = data?.role || 'user';
        console.log("Setting user role to:", userRole);
        setRole(userRole);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  console.log("useUserRole state - role:", role, "loading:", loading, "isAdmin:", role === 'admin');

  return {
    role,
    loading,
    isAdmin: role === 'admin',
    isModerator: role === 'moderator',
  };
}
