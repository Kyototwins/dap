
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
    } else {
      // Call RPC function to join event
      const { data, error } = await supabase.rpc('join_event', {
        p_event_id: eventId,
        p_user_id: userData.user.id
      });

      if (error) {
        throw error;
      }

      if (data && !data.success) {
        toast({
          title: "Could not join event",
          description: data.message || "Unknown error",
          variant: "destructive",
        });
        setProcessingEventId(null);
        return;
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
