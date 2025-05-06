
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

    // Insert the participation record first
    const { error: insertError } = await supabase
      .from("event_participants")
      .insert([{ event_id: eventId, user_id: user.id }]);
      
    if (insertError) {
      console.error("Error inserting participant:", insertError);
      throw insertError;
    }
    
    // Then update the participant count to ensure it's correctly reflected
    // We fetch the current count from the database to ensure accuracy
    const { data: eventData, error: fetchError } = await supabase
      .from("events")
      .select("current_participants")
      .eq("id", eventId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching current participant count:", fetchError);
      throw fetchError;
    }
    
    // Get the actual current count from the database
    const actualCurrentCount = eventData.current_participants || 0;
    
    // Update with the actual current count + 1
    const { error: updateError } = await supabase
      .from("events")
      .update({ current_participants: actualCurrentCount + 1 })
      .eq("id", eventId);
      
    if (updateError) {
      console.error("Error updating participant count:", updateError);
      // If update fails, remove the participation record to maintain consistency
      await supabase
        .from("event_participants")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);
      throw updateError;
    }

    return true; // User is now participating
  } catch (error) {
    console.error("Join event error:", error);
    throw error;
  }
}
