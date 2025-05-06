
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function handleEventAction(eventId: string, eventTitle: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("認証されていません");

    // Fetch event first to get the current state
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("title, max_participants, current_participants")
      .eq("id", eventId)
      .single();
    
    if (eventError) throw eventError;
    if (!event) throw new Error("イベントが見つかりません");
    
    // Check if user is already participating
    const { data: existingParticipation, error: checkError } = await supabase
      .from("event_participants")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) throw checkError;
    
    // If already participating, cancel participation
    if (existingParticipation) {
      const { error: deleteError } = await supabase
        .from("event_participants")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      // Update participant count (decrement by 1)
      const { error: updateError } = await supabase
        .from("events")
        .update({ current_participants: Math.max(0, event.current_participants - 1) })
        .eq("id", eventId);

      if (updateError) throw updateError;
      
      toast({
        title: "参加をキャンセルしました",
        description: `「${eventTitle}」の参加をキャンセルしました。`
      });
      
      return false; // No longer participating
    }

    // If not full, add the user as a participant
    if (event.max_participants === 0 || event.current_participants < event.max_participants) {
      const { error: participationError } = await supabase
        .from("event_participants")
        .insert([{ event_id: eventId, user_id: user.id }]);

      if (participationError) throw participationError;

      // Update participant count (increment by 1)
      const { error: updateError } = await supabase
        .from("events")
        .update({ current_participants: event.current_participants + 1 })
        .eq("id", eventId);

      if (updateError) throw updateError;
      
      toast({
        title: "イベントに参加しました",
        description: `「${eventTitle}」に参加しました。`
      });
      
      return true; // Now participating
    } else {
      throw new Error("イベントは満員です。");
    }
  } catch (error: any) {
    console.error("Event action error:", error);
    toast({
      title: "エラーが発生しました",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}
