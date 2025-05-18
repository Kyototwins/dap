
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { EventParticipation, EventParticipationMap } from "@/types/events";

export function useEventParticipations() {
  const [participations, setParticipations] = useState<EventParticipationMap>({});
  const { toast } = useToast();

  const loadParticipations = useCallback(async () => {
    try {
      console.log("Loading event participations...");
      
      // モックユーザーのイベント参加データ
      const mockParticipationsArray: EventParticipation[] = [
        {
          id: "mock-participation-1",
          event_id: "mock-event-1",
          user_id: "mock-user-id",
          status: "joined",
          created_at: new Date().toISOString()
        }
      ];
      
      // Convert array to map object with event_id as keys
      const participationsMap: EventParticipationMap = {};
      mockParticipationsArray.forEach(participation => {
        participationsMap[participation.event_id] = participation.status === "joined";
      });
      
      console.log(`Generated ${mockParticipationsArray.length} mock participations`);
      setParticipations(participationsMap);
      
      return participationsMap;
    } catch (error: any) {
      console.error("Error loading participations:", error);
      toast({
        title: "エラー",
        description: "イベント参加情報の取得に失敗しました",
        variant: "destructive",
      });
      return {};
    }
  }, [toast]);

  return {
    participations,
    setParticipations,
    loadParticipations
  };
}
