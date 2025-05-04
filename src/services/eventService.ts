
import { supabase } from "@/integrations/supabase/client";

export async function createMessageGroup(eventId: string, eventTitle: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("認証されていません");

  const { data: groupData, error: groupError } = await supabase
    .from("message_groups")
    .insert([
      {
        name: eventTitle,
        event_id: eventId
      }
    ])
    .select()
    .single();

  if (groupError) throw groupError;

  const { error: memberError } = await supabase
    .from("message_group_members")
    .insert([
      {
        group_id: groupData.id,
        user_id: user.id
      }
    ]);

  if (memberError) throw memberError;

  return groupData;
}

export async function joinEvent(eventId: string, eventTitle: string, currentParticipants: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("認証されていません");

  // Check if user is already participating
  const { data: existingParticipation, error: checkError } = await supabase
    .from("event_participants")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    throw checkError;
  }

  if (existingParticipation) {
    throw new Error("You are already participating in this event");
  }

  const { error: participationError } = await supabase
    .from("event_participants")
    .insert([
      {
        event_id: eventId,
        user_id: user.id,
      },
    ]);

  if (participationError) throw participationError;

  const { error: updateError } = await supabase
    .from("events")
    .update({ current_participants: currentParticipants + 1 })
    .eq("id", eventId);

  if (updateError) throw updateError;

  return true;
}
