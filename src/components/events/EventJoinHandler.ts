
import { Event, EventParticipationMap } from "@/types/events";
import { joinEvent } from "@/services/eventService";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  
  try {
    const eventToJoin = filteredEvents.find(e => e.id === eventId);
    if (!eventToJoin) throw new Error("Event not found");
    
    // Get current participation status
    const isCurrentlyParticipating = !!participations[eventId];
    
    // Update UI optimistically
    const updatedParticipations = { ...participations };
    
    if (isCurrentlyParticipating) {
      delete updatedParticipations[eventId];
    } else {
      updatedParticipations[eventId] = true;
    }
    
    // Update UI immediately for better UX
    setParticipations(updatedParticipations);
    
    // Call backend to update participation
    const isJoined = await joinEvent(eventId, eventTitle, eventToJoin.current_participants);
    
    console.log("Join event result:", isJoined, "for event", eventId);
    
    // Show toast notification with correct message based on actual result from server
    toast({
      title: isJoined ? "Joined event" : "Cancelled participation",
      description: isJoined 
        ? "You have successfully joined the event." 
        : "You have cancelled your participation."
    });
    
    // Refresh participation status from server to ensure consistency
    await fetchUserParticipations();
    
    // Refresh events to update participant counts
    await fetchEvents();
  } catch (error: any) {
    console.error("Join event error:", error);
    // Revert UI on error
    toast({
      title: "Error occurred",
      description: error.message,
      variant: "destructive"
    });
    // Only reset on error
    fetchUserParticipations();
    fetchEvents();
  } finally {
    // Clear processing state
    setProcessingEventId(null);
  }
}
