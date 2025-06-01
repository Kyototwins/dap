
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
    loadInitialData,
    refreshEvents
  };
}
