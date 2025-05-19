
import { useEffect } from "react";
import { useMatches } from "@/hooks/useMatches";
import { useMessageSelection } from "@/hooks/useMessageSelection";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import { useMessageUrlParams } from "@/hooks/useMessageUrlParams";
import { useLocation } from "react-router-dom";
import { Match as MessageMatch } from "@/types/messages";

export function useMessages() {
  // Use fetchMatches instead of refreshMatches
  const { matches, loading, fetchMatches } = useMatches();
  
  // Convert matches to the expected type
  const typedMatches = matches as unknown as MessageMatch[];
  
  const { selectedMatch, messages, setMessages, handleSelectMatch } = useMessageSelection(fetchMatches);
  const location = useLocation();
  
  // Set up URL parameter handling - pass the typed matches
  useMessageUrlParams(typedMatches, handleSelectMatch);
  
  // Set up realtime subscription
  useMessageSubscription(selectedMatch, setMessages);

  // Refresh matches whenever a message is added
  useEffect(() => {
    if (messages.length > 0 && selectedMatch) {
      fetchMatches();
    }
  }, [messages.length]);

  // Log debugging information
  useEffect(() => {
    if (matches.length === 0 && !loading) {
      console.log("No matches available");
    } else if (matches.length > 0 && !selectedMatch) {
      console.log(`${matches.length} matches available, none selected`);
    }
  }, [matches, selectedMatch, loading]);

  return {
    matches: typedMatches,
    selectedMatch,
    messages,
    loading,
    handleSelectMatch,
    setMessages,
    fetchMatches,
  };
}
