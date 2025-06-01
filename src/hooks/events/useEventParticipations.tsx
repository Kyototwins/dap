
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchUserParticipations } from "@/services/eventDataService";
import { supabase } from "@/integrations/supabase/client";

export function useEventParticipations() {
  const [participations, setParticipations] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  // On mount, load from localStorage first for immediate UI feedback
  useEffect(() => {
    const getUserKey = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      
      const userKey = `joined_events_${data.user.id}`;
      try {
        const storedParticipations = localStorage.getItem(userKey);
        if (storedParticipations) {
          setParticipations(JSON.parse(storedParticipations));
        }
      } catch (error) {
        console.error("Failed to load participations from localStorage", error);
      }
    };
    
    getUserKey();
  }, []);

  const loadParticipations = async () => {
    try {
      const participationsData = await fetchUserParticipations();
      console.log("Loaded participations from server:", participationsData);
      
      // Get current user to create user-specific localStorage key
      const { data } = await supabase.auth.getUser();
      if (!data.user) return {};
      
      const userKey = `joined_events_${data.user.id}`;
      
      // Use server data as the source of truth
      setParticipations(participationsData);
      
      // Update localStorage with server data
      try {
        localStorage.setItem(userKey, JSON.stringify(participationsData));
      } catch (localError) {
        console.error("Error updating localStorage:", localError);
      }
      
      return participationsData;
    } catch (error: any) {
      console.error("Failed to load participation status from server:", error);
      toast({
        title: "Error loading participations",
        description: error.message,
        variant: "destructive",
      });
      return {};
    }
  };

  return {
    participations,
    setParticipations,
    loadParticipations
  };
}
