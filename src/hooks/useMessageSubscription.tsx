
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Match, Message } from "@/types/messages";
import { createStandardizedUserObject } from "@/utils/profileDataUtils";

// Handle real-time message updates via Supabase channels
export function useMessageSubscription(
  selectedMatch: Match | null, 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  // Set up realtime subscription when the component mounts or when selectedMatch changes
  useEffect(() => {
    if (!selectedMatch) return;
    
    console.log(`Setting up message subscription for match: ${selectedMatch.id}`);
    
    // Create a channel with a unique name for this match
    const channel = supabase
      .channel(`messages-channel-${selectedMatch.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${selectedMatch.id}` // Only listen for this specific match
      }, async payload => {
        console.log("New message received:", payload.new);
        
        // Skip processing if message is missing required data
        if (!payload.new) return;
        
        // Get sender information
        const { data: senderData, error: senderError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', payload.new.sender_id)
          .single();
        
        if (senderError) {
          console.error("Error fetching sender data:", senderError);
          return;
        }
        
        // Create standardized sender object
        const sender = createStandardizedUserObject(senderData);
        if (!sender) {
          console.error("Could not create standardized sender object");
          return;
        }
        
        // Create message object for UI that conforms to Message type
        const newMessage: Message = {
          id: payload.new.id,
          content: payload.new.content,
          created_at: payload.new.created_at,
          sender_id: payload.new.sender_id,
          // Include these properties to match our updated Message interface
          match_id: payload.new.match_id
        };
        
        // Create enhanced message with sender
        const enhancedMessage = {
          ...newMessage,
          sender
        };
        
        // Add message to state, avoiding duplicates
        setMessages(prev => {
          if (prev.some(msg => msg.id === enhancedMessage.id)) {
            console.log("Duplicate message, not adding:", enhancedMessage.id);
            return prev;
          }
          
          console.log("Adding message to state:", enhancedMessage.id);
          return [...prev, enhancedMessage as unknown as Message];
        });
      })
      .subscribe();
      
    console.log("Message subscription activated for match:", selectedMatch.id);

    // Clean up subscription when component unmounts or selectedMatch changes
    return () => {
      console.log("Cleaning up message subscription for match:", selectedMatch.id);
      supabase.removeChannel(channel);
    };
  }, [selectedMatch, setMessages]);
}
