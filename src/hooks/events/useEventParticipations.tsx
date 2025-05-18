
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchUserParticipations } from "@/services/eventDataService";
import { supabase } from "@/integrations/supabase/client";

export function useEventParticipations() {
  const [participations, setParticipations] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  // On mount, load from localStorage first for immediate UI feedback
  useEffect(() => {
    // Create a user-specific key for localStorage
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
      
      // Merge server data with localStorage data for persistence
      try {
        const storedParticipations = localStorage.getItem(userKey) || '{}';
        const storedData = JSON.parse(storedParticipations);
        
        // Combine both sources, server data takes precedence
        const mergedParticipations = { ...storedData, ...participationsData };
        
        // Update state
        setParticipations(mergedParticipations);
        
        // Store back to localStorage for persistence
        localStorage.setItem(userKey, JSON.stringify(mergedParticipations));
      } catch (localError) {
        console.error("Error handling localStorage:", localError);
        // Fallback to just server data if localStorage fails
        setParticipations(participationsData);
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
