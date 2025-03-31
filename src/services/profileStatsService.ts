
import { supabase } from "@/integrations/supabase/client";

export interface UserStats {
  connectionsCount: number;
  eventsCount: number;
}

export async function fetchUserStats(userId: string): Promise<UserStats> {
  try {
    // Get matches count (connections)
    const { data: matchesData, error: matchesError } = await supabase
      .from("matches")
      .select("id")
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (matchesError) throw matchesError;

    // Get events participation count
    const { data: eventsData, error: eventsError } = await supabase
      .from("event_participants")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "confirmed");

    if (eventsError) throw eventsError;

    return {
      connectionsCount: matchesData ? matchesData.length : 0,
      eventsCount: eventsData ? eventsData.length : 0,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      connectionsCount: 0,
      eventsCount: 0,
    };
  }
}
