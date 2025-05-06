
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchUserParticipations } from "@/services/eventDataService";

export function useEventParticipations() {
  const [participations, setParticipations] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  // On mount, load from localStorage first for immediate UI feedback
  useEffect(() => {
    try {
      const storedParticipations = localStorage.getItem('joined_events');
      if (storedParticipations) {
        setParticipations(JSON.parse(storedParticipations));
      }
    } catch (error) {
      console.error("Failed to load participations from localStorage", error);
    }
  }, []);

  const loadParticipations = async () => {
    try {
      const participationsData = await fetchUserParticipations();
      console.log("Loaded participations from server:", participationsData);
      
      // Merge server data with localStorage data for persistence
      try {
        const storedParticipations = localStorage.getItem('joined_events') || '{}';
        const storedData = JSON.parse(storedParticipations);
        
        // Combine both sources, server data takes precedence
        const mergedParticipations = { ...storedData, ...participationsData };
        
        // Update state
        setParticipations(mergedParticipations);
        
        // Store back to localStorage for persistence
        localStorage.setItem('joined_events', JSON.stringify(mergedParticipations));
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
