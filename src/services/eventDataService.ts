
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
