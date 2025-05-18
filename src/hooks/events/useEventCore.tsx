
import { useState, useCallback } from "react";
import { Event } from "@/types/events";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useEventCore() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Loading events...");
      
      // モックイベントデータを作成
      const currentDate = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(currentDate.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(currentDate.getDate() + 7);
      
      const mockEvents: Event[] = [
        {
          id: "mock-event-1",
          title: "京都観光ツアー",
          description: "京都の有名な観光地を巡るツアーです。一緒に日本の伝統文化を体験しましょう！",
          location: "京都駅中央口",
          date: tomorrow.toISOString(),
          max_participants: 10,
          current_participants: 3,
          creator_id: "mock-user-id",
          created_at: currentDate.toISOString(),
          category: "culture",
          image_url: "/lovable-uploads/65f3a573-3b4d-4ec7-90e5-78fab77b800d.png",
          status: "active",
          map_link: "https://goo.gl/maps/abcdefg"
        },
        {
          id: "mock-event-2",
          title: "言語交換カフェ会",
          description: "日本語と英語を練習したい方のためのカフェ会です。気軽に参加してください！",
          location: "スターバックス 三条河原町店",
          date: nextWeek.toISOString(),
          max_participants: 8,
          current_participants: 5,
          creator_id: "other-user-id",
          created_at: currentDate.toISOString(),
          category: "language",
          image_url: "/lovable-uploads/9797c959-5651-45e5-b6fc-2d1ff0c0b223.png",
          status: "active",
          map_link: "https://goo.gl/maps/hijklmn"
        }
      ];
      
      console.log(`Generated ${mockEvents.length} mock events`);
      setEvents(mockEvents);
    } catch (error: any) {
      console.error("Error loading events:", error);
      toast({
        title: "エラー",
        description: "イベントの読み込みに失敗しました",
        variant: "destructive",
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const refreshEvents = useCallback(async () => {
    return await loadInitialData();
  }, [loadInitialData]);

  return {
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent,
    loading,
    loadInitialData,
    refreshEvents
  };
}
