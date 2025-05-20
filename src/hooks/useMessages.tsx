
import { useEffect } from "react";
import { useMatches } from "@/hooks/useMatches";
import { useMessageSelection } from "@/hooks/useMessageSelection";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import { useMessageUrlParams } from "@/hooks/useMessageUrlParams";
import { useLocation } from "react-router-dom";
import type { Match } from "@/types/messages";

export function useMessages() {
  const { matches, loading, fetchMatches } = useMatches();
  const { selectedMatch, messages, setMessages, handleSelectMatch } = useMessageSelection(fetchMatches);
  const location = useLocation();
  
  // Set up URL parameter handling
  useMessageUrlParams(matches, handleSelectMatch);
  
  // Set up realtime subscription
  useMessageSubscription(selectedMatch?.id || null, setMessages);

  // Log debugging information
  useEffect(() => {
    if (matches.length === 0 && !loading) {
      console.log("No matches available");
    } else if (matches.length > 0 && !selectedMatch) {
      console.log(`${matches.length} matches available, none selected`);
    }
  }, [matches, selectedMatch, loading]);

  return {
    matches,
    selectedMatch,
    messages,
    loading,
    handleSelectMatch,
    setMessages,
    fetchMatches,
  };
}
