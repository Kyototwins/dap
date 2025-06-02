
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/messages";
import { mapProfileData } from "@/utils/profileDataMapper";
import { calculateProfileCompletion } from "@/utils/profileUtils";

export function useProfileFetch() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserOrigin, setCurrentUserOrigin] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get current user's origin
      const { data: currentUserProfile } = await supabase
        .from("profiles")
        .select("origin")
        .eq("id", user.id)
        .single();

      console.log("Current user profile:", currentUserProfile);
      
      if (currentUserProfile) {
        setCurrentUserOrigin(currentUserProfile.origin);
        console.log("Current user origin set to:", currentUserProfile.origin);
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id);

      if (error) throw error;
      
      // Map and filter the data
      const typedProfiles = data?.map(mapProfileData) || [];
      
      console.log("Total profiles fetched:", typedProfiles.length);
      console.log("Sample profile origins:", typedProfiles.slice(0, 5).map(p => ({ name: p.first_name, origin: p.origin })));
      
      // プロフィール完了率が30%以下のユーザーを除外
      const filteredByCompletion = typedProfiles.filter(profile => {
        const completion = calculateProfileCompletion(profile);
        return completion > 30;
      });
      
      console.log("Profiles after completion filter:", filteredByCompletion.length);
      
      setProfiles(filteredByCompletion);
      return filteredByCompletion;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    profiles,
    loading,
    currentUserOrigin,
    fetchProfiles,
    setProfiles
  };
}
