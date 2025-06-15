
import { supabase } from "@/integrations/supabase/client";

export interface EventParticipant {
  id: string;
  user_id: string;
  user: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

export async function fetchEventParticipants(eventId: string): Promise<EventParticipant[]> {
  try {
    const { data, error } = await supabase
      .from("event_participants")
      .select(`
        id,
        user_id,
        user:profiles!user_id(
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq("event_id", eventId);

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching event participants:", error);
    throw error;
  }
}
