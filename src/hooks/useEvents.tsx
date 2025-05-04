
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Event } from "@/types/events";
import { fetchEvents } from "@/services/eventDataService";
import { useEventFilters } from "@/hooks/events/useEventFilters";
import { useEventComments } from "@/hooks/events/useEventComments";
import { useEventParticipations } from "@/hooks/events/useEventParticipations";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const {
    filteredEvents,
    searchQuery,
    setSearchQuery,
    timeFilter,
    setTimeFilter,
    categoryFilter,
    setCategoryFilter,
    sortOption,
    setSortOption
  } = useEventFilters(events);

  const {
    comments,
    newComment,
    setNewComment,
    handleSubmitComment
  } = useEventComments(selectedEvent);

  const {
    participations,
    loadParticipations
  } = useEventParticipations();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [eventsData, participationsData] = await Promise.all([
        fetchEvents(),
        loadParticipations()
      ]);
      
      setEvents(eventsData);
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = async () => {
    try {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    } catch (error: any) {
      toast({
        title: "イベントの更新に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmitEventComment = async () => {
    if (!selectedEvent) return;
    await handleSubmitComment(selectedEvent.id);
  };

  return {
    events,
    filteredEvents,
    selectedEvent,
    setSelectedEvent,
    comments,
    newComment,
    setNewComment,
    participations,
    loading,
    searchQuery,
    setSearchQuery,
    timeFilter,
    setTimeFilter,
    categoryFilter,
    setCategoryFilter,
    sortOption,
    setSortOption,
    handleSubmitComment: handleSubmitEventComment,
    fetchEvents: refreshEvents,
    fetchUserParticipations: loadParticipations
  };
}
