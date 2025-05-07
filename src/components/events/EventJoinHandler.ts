
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
    
    // Set processing state
    setProcessingEventId(eventId);
    
    // Call backend to update participation
    const isJoined = await joinEvent(eventId, eventTitle);
    
    console.log("Join event result:", isJoined, "for event", eventId);
    
    if (isJoined) {
      // Update participation status in local state
      const updatedParticipations = { ...participations };
      updatedParticipations[eventId] = true;
      setParticipations(updatedParticipations);
      
      // Show toast notification
      showToast({
        title: "Joined the event",
        description: `You've joined "${eventTitle}".`
      });
      
      // Update localStorage
      try {
        const joinedEventsStr = localStorage.getItem('joined_events') || '{}';
        const joinedEvents = JSON.parse(joinedEventsStr);
        joinedEvents[eventId] = true;
        localStorage.setItem('joined_events', JSON.stringify(joinedEvents));
        
        // Save updated participant count
        const currentCount = eventToJoin.current_participants + 1;
        localStorage.setItem(`event_${eventId}_count`, String(currentCount));
      } catch (storageError) {
        console.error("Error storing joined event status in localStorage:", storageError);
      }
    }
    
    // Refresh participation status and events data from server
    await fetchUserParticipations();
    await fetchEvents();
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
