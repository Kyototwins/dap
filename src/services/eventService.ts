
import { supabase } from "@/integrations/supabase/client";

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

    // If already participating, do nothing and return true
    if (existingParticipation) {
      return true;
    } else {
      // Call the join_event function with parameters as an object
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
