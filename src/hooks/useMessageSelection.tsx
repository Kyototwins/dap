import { useState, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMatchMessages } from "@/hooks/useMatchMessages";
import type { Match } from "@/types/messages";

export function useMessageSelection(fetchMatches: () => Promise<void>) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const { messages, setMessages, fetchMessages } = useMatchMessages();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const processingRef = useRef(false);
  const currentMatchIdRef = useRef<string | null>(null);
  const selectionTimeoutRef = useRef<number | null>(null);
  const selectionErrorCountRef = useRef<number>(0);

  const handleSelectMatch = useCallback(async (match: Match) => {
    // Prevent multiple simultaneous selections with both state and ref
    if (processingRef.current || loading) {
      console.log("Match selection already in progress, skipping", match.id);
      return;
    }
    
    // Prevent reselecting the same match
    if (currentMatchIdRef.current === match.id && selectedMatch?.id === match.id) {
      console.log("Match already selected, skipping", match.id);
      return;
    }
    
    try {
      // Update processing state
      processingRef.current = true;
      setLoading(true);
      
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
        try {
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
        } catch (error) {
          console.error("Error creating welcome message:", error);
          // Continue even if welcome message creation fails
        }
      }
      
      // Mark messages as read if needed
      if (match.unreadCount && match.unreadCount > 0) {
        console.log(`Marking ${match.unreadCount} messages as read`);
        
        try {
          // Refresh matches to update UI
          await fetchMatches();
        } catch (error) {
          console.error("Error refreshing matches:", error);
          // Continue even if refresh fails
        }
      }
      
      // Reset error counter on success
      selectionErrorCountRef.current = 0;
    } catch (error) {
      console.error("Error in handleSelectMatch:", error);
      // Increment error counter
      selectionErrorCountRef.current += 1;
      
      // Only show toast after multiple consecutive errors
      if (selectionErrorCountRef.current > 2) {
        toast({
          title: "エラー",
          description: "メッセージの読み込みに失敗しました",
          variant: "destructive",
        });
      }
      
      // Keep current selection on error if we already had one
      if (selectedMatch) {
        currentMatchIdRef.current = selectedMatch.id;
      } else {
        // Reset current match ID ref on error if no previous selection
        currentMatchIdRef.current = null;
      }
    } finally {
      // Reset processing state with a small delay to prevent race conditions
      selectionTimeoutRef.current = window.setTimeout(() => {
        setLoading(false);
        processingRef.current = false;
        selectionTimeoutRef.current = null;
      }, 300) as unknown as number;
    }
  }, [selectedMatch, fetchMessages, fetchMatches, loading, toast]);

  // Cleanup timeout on unmount
  useCallback(() => {
    return () => {
      if (selectionTimeoutRef.current) {
        window.clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, []);

  return {
    selectedMatch,
    messages,
    setMessages,
    handleSelectMatch,
    loading
  };
}
