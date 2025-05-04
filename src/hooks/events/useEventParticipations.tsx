
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
      console.error("参加状況の更新に失敗しました:", error);
      return {};
    }
  };

  return {
    participations,
    setParticipations,
    loadParticipations
  };
}
