
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
      const { error: deleteError } = await supabase
        .from("event_participants")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (deleteError) {
        console.error("Error deleting participation:", deleteError);
        throw deleteError;
      }

      // Update participant count (decrement by 1)
      const { error: updateError } = await supabase
        .from("events")
        .update({ current_participants: Math.max(0, currentParticipants - 1) })
        .eq("id", eventId);

      if (updateError) {
        console.error("Error updating participant count:", updateError);
        throw updateError;
      }
      
      return false; // User is no longer participating
    }

    // User is not participating, so add them
    const { error: participationError } = await supabase
      .from("event_participants")
      .insert([
        {
          event_id: eventId,
          user_id: user.id,
        },
      ]);

    if (participationError) {
      console.error("Error adding participation:", participationError);
      throw participationError;
    }

    // Update participant count (increment by 1)
    const { error: updateError } = await supabase
      .from("events")
      .update({ current_participants: currentParticipants + 1 })
      .eq("id", eventId);

    if (updateError) {
      console.error("Error updating participant count:", updateError);
      throw updateError;
    }

    return true; // User is now participating
  } catch (error) {
    console.error("Join event error:", error);
    throw error;
  }
}
