
import { useEffect } from "react";
import { useMatches } from "@/hooks/useMatches";
import { useMessageSelection } from "@/hooks/useMessageSelection";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import { useMessageUrlParams } from "@/hooks/useMessageUrlParams";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useMessages() {
  const { matches, loading, fetchMatches } = useMatches();
  const { selectedMatch, messages, setMessages, handleSelectMatch } = useMessageSelection(fetchMatches);
  const location = useLocation();
  
  // Set up URL parameter handling
  useMessageUrlParams(matches, handleSelectMatch);
  
  // Set up realtime subscription
  useMessageSubscription(selectedMatch, setMessages);

  // Mark messages as read when selecting a match
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!selectedMatch) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Determine if the current user is user1 or user2
        const isUser1 = selectedMatch.user1_id === user.id;
        const updateField = isUser1 ? "user1_last_read" : "user2_last_read";
        
        // Update the last read timestamp
        const { error } = await supabase
          .from("matches")
          .update({ [updateField]: new Date().toISOString() })
          .eq("id", selectedMatch.id);
          
        if (error) {
          console.error("Error updating last read timestamp:", error);
        }
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };
    
    markMessagesAsRead();
  }, [selectedMatch]);

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
