
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMatches } from "@/hooks/useMatches";
import { useMatchMessages } from "@/hooks/useMatchMessages";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";
import type { Match } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";

export function useMessages() {
  const { matches, loading, fetchMatches } = useMatches();
  const { messages, setMessages, fetchMessages } = useMatchMessages();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  // URLから特定のユーザーIDを取得
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userIdFromUrl = searchParams.get('user');
  
  // データロード時に自動的に選択
  useEffect(() => {
    if (userIdFromUrl && matches.length > 0 && !selectedMatch) {
      const matchWithUser = matches.find(match => 
        match.otherUser.id === userIdFromUrl
      );
      
      if (matchWithUser) {
        handleSelectMatch(matchWithUser);
      }
    }
  }, [userIdFromUrl, matches, selectedMatch]);
  
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
    fetchMatches
  };
}
