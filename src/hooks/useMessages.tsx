
import { useState, useEffect } from "react";
import { useMatches } from "@/hooks/useMatches";
import { useMatchMessages } from "@/hooks/useMatchMessages";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import type { Match } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";

export function useMessages() {
  const { matches, loading, fetchMatches } = useMatches();
  const { messages, setMessages, fetchMessages } = useMatchMessages();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  // Set up realtime subscription
  useMessageSubscription(selectedMatch, setMessages);

  const handleSelectMatch = async (match: Match) => {
    console.log("Selecting match:", match.id);
    setSelectedMatch(match);
    
    // Fetch messages for this match
    const fetchedMessages = await fetchMessages(match.id);
    console.log(`Fetched ${fetchedMessages.length} messages for match ${match.id}`);
    
    // Mark messages as read if needed
    if (match.unreadCount > 0) {
      // Update the matches list to reflect that messages have been read
      fetchMatches();
    }
  };

  return {
    matches,
    selectedMatch,
    messages,
    loading,
    handleSelectMatch,
    setMessages,
  };
}
