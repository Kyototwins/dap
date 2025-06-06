
import { Event, EventParticipationMap } from "@/types/events";
import { joinEvent } from "@/services/eventService";
import { toast as showToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    
    // Get current user
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not authenticated");
    
    const userId = data.user.id;
    
    // Call backend to update participation - this now properly updates current_participants
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
      
      // Update localStorage with user-specific key
      try {
        const userKey = `joined_events_${userId}`;
        const joinedEventsStr = localStorage.getItem(userKey) || '{}';
        const joinedEvents = JSON.parse(joinedEventsStr);
        joinedEvents[eventId] = true;
        localStorage.setItem(userKey, JSON.stringify(joinedEvents));
      } catch (storageError) {
        console.error("Error storing joined event status in localStorage:", storageError);
      }
    }
    
    // Always refresh both participation status and events data from server 
    // This ensures current_participants count is updated from database
    await Promise.all([
      fetchUserParticipations(),
      fetchEvents()
    ]);
    
  } catch (error: any) {
    console.error("Join event error:", error);
    // Show error message
    showToast({
      title: "Error occurred",
      description: error.message,
      variant: "destructive"
    });
    
    // Refresh data from server to ensure UI is in sync
    await Promise.all([
      fetchUserParticipations(),
      fetchEvents()
    ]);
  } finally {
    // Clear processing state
    setProcessingEventId(null);
  }
}
