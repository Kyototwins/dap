
import { useState, useCallback } from "react";
import { Event, EventDeleteResult } from "@/types/events";
import { toast } from "@/hooks/use-toast";
import { deleteEventById } from "@/services/eventDataService";

/**
 * Hook for event actions like deleting events
 */
export function useEventActions(setEvents: React.Dispatch<React.SetStateAction<Event[]>>) {
  const [processingEventId, setProcessingEventId] = useState<string | null>(null);

  const deleteEvent = useCallback(async (eventId: string): Promise<boolean> => {
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
  }, [setEvents]);

  return {
    processingEventId,
    setProcessingEventId,
    deleteEvent
  };
}
