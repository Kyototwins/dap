
import { useState, useEffect, useCallback } from "react";
import { fetchUserProfile as apiFetchUserProfile } from "@/services/profileService";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { useAuth } from "@/hooks/useAuth";

export function useProfileFetching() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchUserProfile = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return null;
    }

    try {
      setIsLoading(true);
      const profileData = await apiFetchUserProfile(user.id);
      setProfile(profileData);
      setIsLoading(false);
      return profileData;
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error as Error);
      setIsLoading(false);
      return null;
    }
  }, [user?.id]);

  const refreshProfile = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  // Initial profile fetch
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return { profile, isLoading, error, refreshProfile, fetchUserProfile };
}
