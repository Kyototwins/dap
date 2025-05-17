
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMatchMessages } from "@/hooks/useMatchMessages";
import type { Match } from "@/types/messages";

export function useMessageSelection(fetchMatches: () => Promise<void>) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const { messages, setMessages, fetchMessages } = useMatchMessages();
  const { toast } = useToast();
  const [processingMatchSelection, setProcessingMatchSelection] = useState(false);
  const processingRef = useRef(false);
  const currentMatchIdRef = useRef<string | null>(null);
  const selectionTimeoutRef = useRef<number | null>(null);

  const handleSelectMatch = useCallback(async (match: Match) => {
    // Prevent multiple simultaneous selections with both state and ref
    if (processingRef.current || processingMatchSelection) {
      console.log("Match selection already in progress, skipping", match.id);
      return;
    }
    
    // Prevent reselecting the same match
    if (currentMatchIdRef.current === match.id) {
      console.log("Match already selected, skipping", match.id);
      return;
    }
    
    try {
      // Update processing state
      processingRef.current = true;
      setProcessingMatchSelection(true);
      
      // Clear any existing selection timeout
      if (selectionTimeoutRef.current) {
        window.clearTimeout(selectionTimeoutRef.current);
      }
      
      console.log("Selecting match:", match.id);
      
      // Update the current match ID ref immediately
      currentMatchIdRef.current = match.id;
      setSelectedMatch(match);
      
      // Fetch messages for this match
      const fetchedMessages = await fetchMessages(match.id);
      console.log(`Fetched ${fetchedMessages.length} messages for match ${match.id}`);
      
      // If no messages exist, create an initial welcome message
      if (fetchedMessages.length === 0) {
        console.log("No messages found, creating initial message");
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        // Create welcome message
        const { data: newMessage, error: messageError } = await supabase
          .from("messages")
          .insert([{
            match_id: match.id,
            sender_id: user.id,
            content: "こんにちは！よろしくお願いします。"
          }])
          .select();
        
        if (messageError) {
          console.error("Error creating welcome message:", messageError);
        } else if (newMessage) {
          console.log("Created welcome message:", newMessage[0]);
          // Refresh messages to include the welcome message
          await fetchMessages(match.id);
        }
      }
      
      // Mark messages as read if needed
      if (match.unreadCount && match.unreadCount > 0) {
        console.log(`Marking ${match.unreadCount} messages as read`);
        
        // Refresh matches to update UI
        await fetchMatches();
      }
    } catch (error) {
      console.error("Error in handleSelectMatch:", error);
      // Reset current match ID ref on error
      currentMatchIdRef.current = selectedMatch?.id || null;
      
      toast({
        title: "エラー",
        description: "メッセージの読み込みに失敗しました",
        variant: "destructive",
      });
    } finally {
      // Reset processing state with a small delay to prevent race conditions
      selectionTimeoutRef.current = window.setTimeout(() => {
        setProcessingMatchSelection(false);
        processingRef.current = false;
        selectionTimeoutRef.current = null;
      }, 300) as unknown as number;
    }
  }, [selectedMatch, fetchMessages, fetchMatches, processingMatchSelection, toast]);

  return {
    selectedMatch,
    messages,
    setMessages,
    handleSelectMatch
  };
}
