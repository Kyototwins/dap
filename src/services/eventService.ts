
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

    // If already participating, just return true (do nothing)
    if (existingParticipation) {
      return true; // User is already participating
    }

    // User is not participating, so add them
    // First, insert the participation record directly
    const { error: insertError } = await supabase
      .from("event_participants")
      .insert([{ event_id: eventId, user_id: user.id }]);
      
    if (insertError) {
      console.error("Error inserting participant:", insertError);
      throw insertError;
    }
    
    // Then update the participant count
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
