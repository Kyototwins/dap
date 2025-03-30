
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

  await createMessageGroup(eventId, eventTitle);

  return true;
}
