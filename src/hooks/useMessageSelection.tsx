
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMatchMessages } from "@/hooks/useMatchMessages";
import type { Match, Message } from "@/types/messages";

export function useMessageSelection(fetchMatches: () => Promise<void>) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const { messages, setMessages, fetchMessages } = useMatchMessages();
  const { toast } = useToast();
  const [processingMatchSelection, setProcessingMatchSelection] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  const handleSelectMatch = async (match: Match) => {
    // Prevent multiple simultaneous selections
    if (processingMatchSelection) return;
    
    try {
      setProcessingMatchSelection(true);
      console.log("Selecting match:", match.id);
      
      // First set selected match to update UI immediately
      setSelectedMatch(match);
      // Reset messages loaded state
      setMessagesLoaded(false);
      
      // Fetch messages for this match
      const fetchedMessages = await fetchMessages(match.id);
      console.log(`Fetched ${fetchedMessages.length} messages for match ${match.id}`);
      
      // Mark messages as loaded
      setMessagesLoaded(true);
      
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
      toast({
        title: "エラー",
        description: "メッセージの読み込みに失敗しました",
        variant: "destructive",
      });
    } finally {
      setProcessingMatchSelection(false);
    }
  };

  return {
    selectedMatch,
    messages,
    setMessages,
    messagesLoaded,
    handleSelectMatch
  };
}
