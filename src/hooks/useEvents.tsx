
import { useState, useEffect, useCallback } from "react";
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
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Window visible, refreshing participations and events");
        loadParticipations();
        refreshEvents();
      }
    };
    
    const handleFocus = () => {
      console.log("Window focused, refreshing participations and events");
      loadParticipations();
      refreshEvents();
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
        refreshEvents();
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
      
      // Apply any stored participant counts from localStorage
      eventsData.forEach(event => {
        const storedCount = localStorage.getItem(`event_${event.id}_count`);
        if (storedCount) {
          const count = parseInt(storedCount, 10);
          // Only use the stored count if it's higher than the current count
          if (count > event.current_participants) {
            event.current_participants = count;
          } else {
            // Update localStorage with the current count if it's higher
            localStorage.setItem(`event_${event.id}_count`, String(event.current_participants));
          }
        } else {
          // Initialize localStorage with the current count
          localStorage.setItem(`event_${event.id}_count`, String(event.current_participants));
        }
      });
    } catch (error: any) {
      toast({
        title: "Error occurred",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = useCallback(async () => {
    try {
      const eventsData = await fetchEvents();
      
      // Apply any stored participant counts from localStorage
      eventsData.forEach(event => {
        const storedCount = localStorage.getItem(`event_${event.id}_count`);
        if (storedCount) {
          const count = parseInt(storedCount, 10);
          // Only use the stored count if it's higher than the current count
          if (count > event.current_participants) {
            event.current_participants = count;
          } else {
            // Update localStorage with the current count if it's higher
            localStorage.setItem(`event_${event.id}_count`, String(event.current_participants));
          }
        } else {
          // Initialize localStorage with the current count
          localStorage.setItem(`event_${event.id}_count`, String(event.current_participants));
        }
      });
      
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
        title: "Failed to update events",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [selectedEvent]);

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
        title: "Event deleted",
        description: "The event has been successfully deleted."
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to delete event",
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
