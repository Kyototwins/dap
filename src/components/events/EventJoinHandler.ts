
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
    if (!eventToJoin) throw new Error("イベントが見つかりません");
    
    // Get current participation status
    const isCurrentlyParticipating = !!participations[eventId];
    
    // Set processing state
    setProcessingEventId(eventId);
    
    // Call backend to update participation
    const isParticipatingNow = await joinEvent(eventId, eventTitle, eventToJoin.current_participants);
    
    console.log("Join event result:", isParticipatingNow, "for event", eventId);
    
    // Update UI based on actual result from server
    const updatedParticipations = { ...participations };
    
    if (isParticipatingNow) {
      updatedParticipations[eventId] = true;
    } else {
      delete updatedParticipations[eventId];
    }
    
    // Update UI with correct participation status
    setParticipations(updatedParticipations);
    
    // Show toast notification with correct message based on actual result from server
    showToast({
      title: isParticipatingNow ? "イベントに参加しました" : "参加をキャンセルしました",
      description: isParticipatingNow 
        ? `「${eventTitle}」に参加しました。` 
        : `「${eventTitle}」の参加をキャンセルしました。`
    });
    
    // Refresh participation status and events data from server to ensure consistency
    await Promise.all([
      fetchUserParticipations(),
      fetchEvents()
    ]);
  } catch (error: any) {
    console.error("Join event error:", error);
    // Revert UI on error
    showToast({
      title: "エラーが発生しました",
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
