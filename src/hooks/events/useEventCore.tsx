
import { useState, useCallback } from "react";
import { Event } from "@/types/events";
import { useToast } from "@/components/ui/use-toast";
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
  }, [selectedEvent, toast]);

  return {
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent,
    loading,
    setLoading,
    loadInitialData,
    refreshEvents
  };
}
