
import { supabase } from "@/integrations/supabase/client";

export async function joinEvent(eventId: string, eventTitle: string, currentParticipants: number) {
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

    // If already participating, cancel participation
    if (existingParticipation) {
      // Start a transaction by using RPC
      const { data: result, error: rpcError } = await supabase.rpc('cancel_event_participation', {
        p_event_id: eventId,
        p_user_id: user.id
      });

      if (rpcError) {
        console.error("Error canceling participation:", rpcError);
        throw rpcError;
      }
      
      return false; // User is no longer participating
    }

    // User is not participating, so add them
    // Start a transaction by using RPC
    const { data: result, error: rpcError } = await supabase.rpc('join_event', {
        p_event_id: eventId,
        p_user_id: user.id
    });

    if (rpcError) {
      console.error("Error joining event:", rpcError);
      throw rpcError;
    }

    return true; // User is now participating
  } catch (error) {
    console.error("Join event error:", error);
    throw error;
  }
}
