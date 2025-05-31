
import { useState, useCallback } from "react";
import { Event } from "@/types/events";
import { useToast } from "@/hooks/use-toast";
import { fetchEvents } from "@/services/eventDataService";

/**
 * Core event functionality - events data, loading state, and selected event
 */
export function useEventCore() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const eventsData = await fetchEvents();
      
      // Apply any stored participant counts from localStorage
      const processedEvents = eventsData.map(event => {
        const storedCount = localStorage.getItem(`event_${event.id}_count`);
        if (storedCount) {
          const count = parseInt(storedCount, 10);
          // Only use the stored count if it's higher than the current count
          if (count > event.current_participants) {
            return { ...event, current_participants: count };
          }
        }
        // Update localStorage with the current count
        localStorage.setItem(`event_${event.id}_count`, String(event.current_participants));
        return event;
      });
      
      setEvents(processedEvents);
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
      
      // Only apply stored participant counts for participant management, 
      // not for other event updates
      const processedEvents = eventsData.map(event => {
        const storedCount = localStorage.getItem(`event_${event.id}_count`);
        if (storedCount) {
          const count = parseInt(storedCount, 10);
          // Only override participant count if stored count is higher
          // This ensures other event updates (time, location) are not affected
          if (count > event.current_participants) {
            return { ...event, current_participants: count };
          }
        }
        // Always update localStorage with fresh server data for participant count
        localStorage.setItem(`event_${event.id}_count`, String(event.current_participants));
        return event;
      });
      
      setEvents(processedEvents);
      
      // Update selected event with fresh data from database
      if (selectedEvent) {
        const updatedSelectedEvent = processedEvents.find(event => event.id === selectedEvent.id);
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
  }, [selectedEvent, toast]);

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
