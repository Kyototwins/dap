
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { EventParticipation } from "@/types/events";

export function useEventParticipations() {
  const [participations, setParticipations] = useState<EventParticipation[]>([]);
  const { toast } = useToast();

  const loadParticipations = useCallback(async () => {
    try {
      console.log("Loading event participations...");
      
      // モックユーザーのイベント参加データ
      const mockParticipations: EventParticipation[] = [
        {
          id: "mock-participation-1",
          event_id: "mock-event-1",
          user_id: "mock-user-id",
          status: "joined",
          created_at: new Date().toISOString()
        }
      ];
      
      console.log(`Generated ${mockParticipations.length} mock participations`);
      setParticipations(mockParticipations);
      
      return mockParticipations;
    } catch (error: any) {
      console.error("Error loading participations:", error);
      toast({
        title: "エラー",
        description: "イベント参加情報の取得に失敗しました",
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  return {
    participations,
    setParticipations,
    loadParticipations
  };
}
