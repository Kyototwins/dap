
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Match, Message } from "@/types/messages";
import { createStandardizedUserObject } from "@/utils/profileDataUtils";

export function useMessageSubscription(
  selectedMatch: Match | null, 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  // Set up realtime subscription when the component mounts or when selectedMatch changes
  useEffect(() => {
    if (!selectedMatch) return;
    
    console.log(`Setting up message subscription for match: ${selectedMatch.id}`);
    
    // Set up a realtime subscription for the selected match
    const channel = supabase
      .channel(`messages-channel-${selectedMatch.id}`) // Use unique channel name with match ID
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${selectedMatch.id}` // Only listen for this specific match
      }, async payload => {
        console.log("New message received:", payload.new);
        
        // Get current user for comparison
        const { data: { user } } = await supabase.auth.getUser();
        
        // Only process if relevant to the selected match
        if (payload.new) {
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
          
          if (senderData) {
            console.log("Sender data found:", senderData.id);
            
            // Create sender with standardized format
            const sender = createStandardizedUserObject(senderData);
            
            if (!sender) {
              console.error("Could not create standardized sender object");
              return;
            }
            
            const newMessage: Message = {
              id: payload.new.id,
              content: payload.new.content,
              created_at: payload.new.created_at,
              match_id: payload.new.match_id,
              sender_id: payload.new.sender_id,
              sender: sender
            };
            
            console.log("Adding new message to state:", newMessage.id);
            
            // Add message if it's for the selected match
            setMessages(prev => {
              // Avoid duplicate messages
              if (prev.some(msg => msg.id === newMessage.id)) {
                console.log("Duplicate message, not adding:", newMessage.id);
                return prev;
              }
              
              console.log("Adding message to state:", newMessage.id);
              return [...prev, newMessage];
            });
          }
        }
      })
      .subscribe();
      
    console.log("Message subscription activated for match:", selectedMatch.id);

    return () => {
      console.log("Cleaning up message subscription for match:", selectedMatch.id);
      supabase.removeChannel(channel);
    };
  }, [selectedMatch, setMessages]);
}
