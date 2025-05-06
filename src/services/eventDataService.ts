
import { supabase } from "@/integrations/supabase/client";
import { Event, EventParticipationMap } from "@/types/events";

export async function fetchEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        creator:profiles!creator_id(
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq("status", "active")
      .order("date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function fetchUserParticipations(): Promise<EventParticipationMap> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {};

    const { data, error } = await supabase
      .from("event_participants")
      .select("event_id")
      .eq("user_id", user.id);

    if (error) throw error;

    const participationsMap = (data || []).reduce((acc: EventParticipationMap, participation) => {
      acc[participation.event_id] = true;
      return acc;
    }, {});

    return participationsMap;
  } catch (error: any) {
    console.error("参加状況の取得に失敗しました:", error);
    return {};
  }
}

export async function deleteEventById(eventId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("認証されていません");

    // First check if the user is the event creator
    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("creator_id")
      .eq("id", eventId)
      .single();
      
    if (fetchError) throw fetchError;
    if (!event) throw new Error("イベントが見つかりません");
    
    if (event.creator_id !== user.id) {
      throw new Error("このイベントを削除する権限がありません");
    }

    // First, delete all participants
    const { error: deleteParticipantsError } = await supabase
      .from("event_participants")
      .delete()
      .eq("event_id", eventId);
      
    if (deleteParticipantsError) throw deleteParticipantsError;
    
    // Then, delete all comments
    const { error: deleteCommentsError } = await supabase
      .from("event_comments")
      .delete()
      .eq("event_id", eventId);
      
    if (deleteCommentsError) throw deleteCommentsError;
    
    // Finally, delete the event
    const { error: deleteEventError } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);
      
    if (deleteEventError) throw deleteEventError;
    
  } catch (error: any) {
    console.error("Error deleting event:", error);
    throw error;
  }
}
