
import { useState, useEffect } from "react";
import { useMatches } from "@/hooks/useMatches";
import { useMatchMessages } from "@/hooks/useMatchMessages";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import type { Match } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useMessages() {
  const { matches, loading, fetchMatches } = useMatches();
  const { messages, setMessages, fetchMessages } = useMatchMessages();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const { toast } = useToast();
  
  // Debug log to check matches
  useEffect(() => {
    console.log(`useMessages: ${matches.length} matches available`);
    
    // Auto-select first match if there is one and none selected
    if (matches.length > 0 && !selectedMatch) {
      console.log(`Auto-selecting first match: ${matches[0].id}`);
      handleSelectMatch(matches[0]);
    }
  }, [matches, selectedMatch]);
  
  // Set up realtime subscription
  useMessageSubscription(selectedMatch, setMessages);

  const handleSelectMatch = async (match: Match) => {
    console.log("Selecting match:", match.id);
    setSelectedMatch(match);
    
    try {
      // Fetch messages for this match
      const fetchedMessages = await fetchMessages(match.id);
      console.log(`Fetched ${fetchedMessages.length} messages for match ${match.id}`);
      
      // Mark messages as read if needed
      if (match.unreadCount > 0) {
        // Update the matches list to reflect that messages have been read
        fetchMatches();
      }
    } catch (error) {
      console.error("Error in handleSelectMatch:", error);
      toast({
        title: "エラー",
        description: "メッセージの読み込みに失敗しました",
        variant: "destructive",
      });
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
