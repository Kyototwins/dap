
import { supabase } from "@/integrations/supabase/client";
import { JoinEventResponse } from "@/types/events";

export async function joinEvent(eventId: string, eventTitle: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  try {
    // Check if user is already participating
    const { data: existingParticipation, error: checkError } = await supabase
      .from("event_participants")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking participation:", checkError);
      throw checkError;
    }

    // If already participating, we'll leave the event
    if (existingParticipation) {
      // Call the RPC function to cancel participation
      const { error: cancelError } = await supabase
        .rpc('cancel_event_participation', { 
          p_event_id: eventId, 
          p_user_id: user.id 
        });
      
      if (cancelError) {
        console.error("Error canceling participation:", cancelError);
        throw cancelError;
      }
      
      return false; // User is no longer participating
    } else {
      // Call the RPC function to join the event
      const { error: joinError } = await supabase
        .rpc('join_event', { 
          p_event_id: eventId, 
          p_user_id: user.id 
        });
      
      if (joinError) {
        console.error("Error joining event:", joinError);
        throw joinError;
      }
      
      return true; // User is now participating
    }
  } catch (error) {
    console.error("Join event error:", error);
    throw error;
  }
}
