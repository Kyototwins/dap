
import { Event, EventParticipationMap } from "@/types/events";
import { joinEvent } from "@/services/eventService";
import { toast as showToast } from "@/hooks/use-toast";

export async function handleJoinEvent(
  eventId: string,
  eventTitle: string,
  filteredEvents: Event[],
  participations: EventParticipationMap,
  setParticipations: (participations: EventParticipationMap) => void,
  fetchUserParticipations: () => Promise<EventParticipationMap>,
  fetchEvents: () => Promise<void>,
  setProcessingEventId: (id: string | null) => void
) {
  try {
    const eventToJoin = filteredEvents.find(e => e.id === eventId);
    if (!eventToJoin) throw new Error("Event not found");
    
    // Get current participation status
    const isCurrentlyParticipating = !!participations[eventId];
    
    // Set processing state
    setProcessingEventId(eventId);
    
    // Call backend to update participation
    const isParticipatingNow = await joinEvent(eventId, eventTitle);
    
    console.log("Join/leave event result:", isParticipatingNow, "for event", eventId);
    
    // Update participation status in local state
    const updatedParticipations = { ...participations };
    if (isParticipatingNow) {
      updatedParticipations[eventId] = true;
    } else {
      delete updatedParticipations[eventId];
    }
    setParticipations(updatedParticipations);
    
    // Show toast notification with correct message
    if (isParticipatingNow) {
      showToast({
        title: "Joined the event",
        description: `You've joined "${eventTitle}".`
      });
    } else {
      showToast({
        title: "Left the event",
        description: `You've left "${eventTitle}".`
      });
    }
    
    // Refresh participation status and events data from server
    await fetchUserParticipations();
    
    // We'll handle fetching events immediately to ensure
    // the database has processed the participation update
    await fetchEvents();
    
    // Update localStorage
    try {
      // Get existing joined events or initialize empty object
      const joinedEventsStr = localStorage.getItem('joined_events') || '{}';
      const joinedEvents = JSON.parse(joinedEventsStr);
      
      if (isParticipatingNow) {
        // Mark this event as joined
        joinedEvents[eventId] = true;
      } else {
        // Remove this event from joined events
        delete joinedEvents[eventId];
      }
      
      // Save back to localStorage
      localStorage.setItem('joined_events', JSON.stringify(joinedEvents));
    } catch (storageError) {
      console.error("Error storing joined event status in localStorage:", storageError);
    }
  } catch (error: any) {
    console.error("Join/leave event error:", error);
    // Show error message
    showToast({
      title: "Error occurred",
      description: error.message,
      variant: "destructive"
    });
    // Refresh data from server to ensure UI is in sync
    await fetchUserParticipations();
    await fetchEvents();
  } finally {
    // Clear processing state
    setProcessingEventId(null);
  }
}
