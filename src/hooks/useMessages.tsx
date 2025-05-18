
import { useEffect, useState, useCallback, useRef } from "react";
import { useMatches } from "@/hooks/useMatches";
import { useMessageSelection } from "@/hooks/useMessageSelection";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import { useMessageUrlParams } from "@/hooks/useMessageUrlParams";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useMessages() {
  const { matches, loading: matchesLoading, fetchMatches } = useMatches();
  const [initComplete, setInitComplete] = useState(false);
  const initInProgressRef = useRef(false);
  const location = useLocation();
  const lastMatchesLengthRef = useRef(0);
  const initialLoadProcessedRef = useRef(false);
  
  // Set up message selection with the memoized fetch function
  const { 
    selectedMatch, 
    messages, 
    setMessages, 
    handleSelectMatch,
    loading: selectionLoading
  } = useMessageSelection(fetchMatches);
  
  // Set up URL parameter handling
  const { paramProcessing } = useMessageUrlParams(matches, handleSelectMatch);
  
  // Set up realtime subscription
  useMessageSubscription(selectedMatch, setMessages);

  // Initialization effect - runs only once
  useEffect(() => {
    // Skip if we're already initializing or already initialized
    if (initInProgressRef.current || initialLoadProcessedRef.current) return;
    
    // Wait until we're not loading and have some matches data
    if (matchesLoading) return;
    
    initInProgressRef.current = true;
    console.log("Initializing useMessages hook", { 
      pathname: location.pathname,
      matchCount: matches.length,
      loading: matchesLoading
    });
    
    lastMatchesLengthRef.current = matches.length;
    initialLoadProcessedRef.current = true;
    setInitComplete(true);
    initInProgressRef.current = false;
  }, [matches, matchesLoading, location.pathname]);

  // Track match changes
  useEffect(() => {
    // Skip initialization phase
    if (!initialLoadProcessedRef.current) return;
    
    // Only process if matches count has changed (to avoid unnecessary processing)
    if (matches.length !== lastMatchesLengthRef.current) {
      console.log(`Matches count changed: ${lastMatchesLengthRef.current} -> ${matches.length}`);
      lastMatchesLengthRef.current = matches.length;
    }
  }, [matches]);

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
      isLoading: matchesLoading || selectionLoading || paramProcessing,
      pathname: location.pathname
    });
  }, [matches, selectedMatch, messages, matchesLoading, selectionLoading, paramProcessing, location.pathname]);

  return {
    matches,
    selectedMatch,
    messages,
    loading: matchesLoading || selectionLoading || !initComplete,
    handleSelectMatch,
    setMessages,
    fetchMatches,
  };
}
