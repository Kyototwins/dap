
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUnreadCounts() {
  const [unreadMatches, setUnreadMatches] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadEvents, setUnreadEvents] = useState(0);

  const fetchUnreadCounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Count unread matches (pending likes received)
      const { data: pendingMatches } = await supabase
        .from("matches")
        .select("id")
        .eq("user2_id", user.id)
        .eq("status", "pending");

      setUnreadMatches(pendingMatches?.length || 0);

      // Count unread messages (messages where user is receiver and not read)
      const { data: userMatches } = await supabase
        .from("matches")
        .select("id")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq("status", "matched");

      if (userMatches) {
        const matchIds = userMatches.map(m => m.id);
        
        // Get latest message for each match where user is not sender
        let totalUnread = 0;
        for (const matchId of matchIds) {
          const { data: latestMessage } = await supabase
            .from("messages")
            .select("sender_id, created_at")
            .eq("match_id", matchId)
            .order("created_at", { ascending: false })
            .limit(1);

          if (latestMessage?.[0] && latestMessage[0].sender_id !== user.id) {
            totalUnread++;
          }
        }
        setUnreadMessages(totalUnread);
      }

      // Count new events created in last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data: newEvents } = await supabase
        .from("events")
        .select("id")
        .gte("created_at", yesterday.toISOString());

      setUnreadEvents(newEvents?.length || 0);

    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCounts();
    
    // Refresh counts every 30 seconds
    const interval = setInterval(fetchUnreadCounts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    unreadMatches,
    unreadMessages,
    unreadEvents,
    refreshCounts: fetchUnreadCounts
  };
}
