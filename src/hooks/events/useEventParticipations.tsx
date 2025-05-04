
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchUserParticipations } from "@/services/eventDataService";

export function useEventParticipations() {
  const [participations, setParticipations] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const loadParticipations = async () => {
    try {
      const participationsData = await fetchUserParticipations();
      setParticipations(participationsData);
      return participationsData;
    } catch (error: any) {
      console.error("Failed to load participation status:", error);
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
