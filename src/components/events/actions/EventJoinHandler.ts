
import { Event, EventParticipationMap } from "@/types/events";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function handleJoinEvent(
  eventId: string,
  eventTitle: string,
  events: Event[],
  participations: EventParticipationMap,
  setParticipations: React.Dispatch<React.SetStateAction<EventParticipationMap>>,
  refreshUserParticipations: () => Promise<any>,
  refreshEvents: () => Promise<void>,
  setProcessingEventId: React.Dispatch<React.SetStateAction<string | null>>
) {
  try {
    setProcessingEventId(eventId);
    
    // Get user data
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast({
        title: "You need to be signed in",
        description: "Please sign in to join this event",
        variant: "destructive",
      });
      setProcessingEventId(null);
      return;
    }

    // Check if user is already participating
    if (participations[eventId]) {
      // User is already participating, so we'll leave the event
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userData.user.id);

      if (error) {
        throw error;
      }

      // Update local participation state (optimistic UI update)
      const newParticipations = { ...participations };
      delete newParticipations[eventId];
      setParticipations(newParticipations);

      toast({
        title: "Left event",
        description: `You've successfully left ${eventTitle}`,
      });
      
      // Update the participant count
      const eventToUpdate = events.find(e => e.id === eventId);
      if (eventToUpdate && eventToUpdate.current_participants > 0) {
        const { error: updateError } = await supabase
          .from('events')
          .update({ current_participants: eventToUpdate.current_participants - 1 })
          .eq('id', eventId);
          
        if (updateError) {
          console.error("Error updating participant count:", updateError);
        }
      }
    } else {
      // Instead of using RPC function, we'll manually insert the participation and update count
      
      // First, insert participation record
      const { error: insertError } = await supabase
        .from('event_participants')
        .insert([{ event_id: eventId, user_id: userData.user.id }]);

      if (insertError) {
        throw insertError;
      }
      
      // Update the participant count
      const eventToUpdate = events.find(e => e.id === eventId);
      if (eventToUpdate) {
        const { error: updateError } = await supabase
          .from('events')
          .update({ current_participants: eventToUpdate.current_participants + 1 })
          .eq('id', eventId);
          
        if (updateError) {
          console.error("Error updating participant count:", updateError);
          // If update fails, remove the participation record to maintain consistency
          await supabase
            .from('event_participants')
            .delete()
            .eq('event_id', eventId)
            .eq('user_id', userData.user.id);
          throw updateError;
        }
      }

      // Update local participation state (optimistic UI update)
      setParticipations({
        ...participations,
        [eventId]: true
      });

      toast({
        title: "Joined event",
        description: `You've successfully joined ${eventTitle}`,
      });
    }

    // Refresh participation status and events data
    await Promise.all([
      refreshUserParticipations(),
      refreshEvents()
    ]);

  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "An error occurred",
      variant: "destructive",
    });
  } finally {
    setProcessingEventId(null);
  }
}
