
import { useEffect, useState, useCallback, useRef } from "react";
import { useMatches } from "@/hooks/useMatches";
import { useMessageSelection } from "@/hooks/useMessageSelection";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import { useMessageUrlParams } from "@/hooks/useMessageUrlParams";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useMessages() {
  const { matches, loading: matchesLoading, fetchMatches: fetchMatchesOriginal } = useMatches();
  const [initComplete, setInitComplete] = useState(false);
  const initInProgressRef = useRef(false);
  const location = useLocation();
  
  // Memoize fetchMatches to avoid unnecessary rerenders and dependency changes
  const memoizedFetchMatches = useCallback(async () => {
    console.log("Memoized fetchMatches called");
    await fetchMatchesOriginal();
  }, [fetchMatchesOriginal]);
  
  // Set up message selection with the memoized fetch function
  const { 
    selectedMatch, 
    messages, 
    setMessages, 
    handleSelectMatch 
  } = useMessageSelection(memoizedFetchMatches);
  
  // Set up URL parameter handling
  useMessageUrlParams(matches, handleSelectMatch);
  
  // Set up realtime subscription
  useMessageSubscription(selectedMatch, setMessages);

  // Initialization effect - runs only once
  useEffect(() => {
    if (!initComplete && !initInProgressRef.current && !matchesLoading) {
      initInProgressRef.current = true;
      console.log("Initializing useMessages hook", { 
        pathname: location.pathname,
        matchCount: matches.length,
        loading: matchesLoading
      });
      setInitComplete(true);
      initInProgressRef.current = false;
    }
  }, [initComplete, location.pathname, matches, matchesLoading]);

  // Mark messages as read when selecting a match
  useEffect(() => {
    if (!selectedMatch) return;
    
    const markMessagesAsRead = async () => {
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

  // Debug logging effect
  useEffect(() => {
    console.log("useMessages state updated", {
      matchCount: matches.length,
      hasSelectedMatch: !!selectedMatch,
      messageCount: messages.length,
      isLoading: matchesLoading,
      pathname: location.pathname
    });
  }, [matches, selectedMatch, messages, matchesLoading, location.pathname]);

  return {
    matches,
    selectedMatch,
    messages,
    loading: matchesLoading,
    handleSelectMatch,
    setMessages,
    fetchMatches: memoizedFetchMatches,
  };
}
