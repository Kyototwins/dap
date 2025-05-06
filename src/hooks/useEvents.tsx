
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Event } from "@/types/events";
import { fetchEvents, deleteEventById } from "@/services/eventDataService";
import { useEventFilters } from "@/hooks/events/useEventFilters";
import { useEventComments } from "@/hooks/events/useEventComments";
import { useEventParticipations } from "@/hooks/events/useEventParticipations";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

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
    setParticipations,
    loadParticipations
  } = useEventParticipations();

  // Added focus effect to reload participations when tab/window regains focus
  useEffect(() => {
    const handleFocus = () => {
      console.log("Window focused, refreshing participations");
      loadParticipations();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    loadInitialData();

    // Set up a route change listener to refresh data when returning to this page
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/events') {
        console.log('Back on events page, refreshing data');
        loadParticipations();
      }
    };

    // Add event listener for 'popstate' to detect navigation with browser back/forward buttons
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
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
      
      // Update selected event if it exists
      if (selectedEvent) {
        const updatedSelectedEvent = eventsData.find(event => event.id === selectedEvent.id);
        if (updatedSelectedEvent) {
          setSelectedEvent(updatedSelectedEvent);
        }
      }
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
  
  const deleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      await deleteEventById(eventId);
      
      // Remove the event from local state
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      
      toast({
        title: "イベントを削除しました",
        description: "イベントが正常に削除されました。"
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "イベントの削除に失敗しました",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
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
    setParticipations,
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
    refreshUserParticipations: loadParticipations,
    deleteEvent
  };
}
