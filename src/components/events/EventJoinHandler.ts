
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
    
    // If already participating, do nothing
    if (isCurrentlyParticipating) {
      return;
    }
    
    // Set processing state
    setProcessingEventId(eventId);
    
    // Call backend to update participation
    const isParticipatingNow = await joinEvent(eventId, eventTitle, eventToJoin.current_participants);
    
    console.log("Join event result:", isParticipatingNow, "for event", eventId);
    
    // Update participation status in local state
    const updatedParticipations = { ...participations };
    updatedParticipations[eventId] = true;
    setParticipations(updatedParticipations);
    
    // Show toast notification with correct message
    showToast({
      title: "Joined the event",
      description: `You've joined "${eventTitle}".`
    });
    
    // Refresh participation status and events data from server
    await fetchUserParticipations();
    
    // We'll handle fetching events immediately to ensure
    // the database has processed the participation update
    await fetchEvents();
    
    // Store in localStorage that this user has joined this event
    // This helps with persistence between page loads
    try {
      // Get existing joined events or initialize empty object
      const joinedEventsStr = localStorage.getItem('joined_events') || '{}';
      const joinedEvents = JSON.parse(joinedEventsStr);
      
      // Mark this event as joined
      joinedEvents[eventId] = true;
      
      // Save back to localStorage
      localStorage.setItem('joined_events', JSON.stringify(joinedEvents));
    } catch (storageError) {
      console.error("Error storing joined event in localStorage:", storageError);
      // Non-critical error, we can continue
    }
  } catch (error: any) {
    console.error("Join event error:", error);
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
