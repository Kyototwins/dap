
import { useState } from "react";
import { useMatches } from "@/hooks/useMatches";
import { useMatchMessages } from "@/hooks/useMatchMessages";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import type { Match } from "@/types/messages";

export function useMessages() {
  const { matches, loading } = useMatches();
  const { messages, setMessages, fetchMessages } = useMatchMessages();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  // Set up realtime subscription
  useMessageSubscription(selectedMatch, setMessages);

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    fetchMessages(match.id);
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
