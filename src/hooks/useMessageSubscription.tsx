
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";

export function useMessageSubscription(
  matchId: string | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    // Return early if there's no matchId
    if (!matchId) {
      return () => {};
    }

    const setupSubscription = async () => {
      console.log(`Setting up message subscription for match ${matchId}`);
      
      // Clean up any existing subscription
      if (subscriptionRef.current) {
        console.log("Removing existing subscription");
        subscriptionRef.current.unsubscribe();
      }
      
      // Set up real-time subscription to messages for this match
      const subscription = supabase
        .channel(`messages:match_id=eq.${matchId}`)
        .on(
          "postgres_changes",
          { 
            event: "INSERT", 
            schema: "public", 
            table: "messages",
            filter: `match_id=eq.${matchId}` 
          },
          (payload) => {
            console.log("New message received from subscription:", payload);
            
            // Add the new message to the messages state
            const newMessage = payload.new as any;
            
            setMessages((prevMessages) => {
              // Check if message already exists
              const exists = prevMessages.some((msg) => msg.id === newMessage.id);
              if (exists) {
                return prevMessages;
              }
              
              // Add new message with necessary type conversion
              return [
                ...prevMessages,
                {
                  id: newMessage.id,
                  content: newMessage.content,
                  created_at: newMessage.created_at,
                  sender_id: newMessage.sender_id,
                  receiver_id: newMessage.receiver_id || "", // Add empty string if null
                  match_id: newMessage.match_id
                },
              ];
            });
          }
        )
        .subscribe((status) => {
          console.log("Subscription status:", status);
        });

      // Store the subscription reference
      subscriptionRef.current = subscription;
    };

    setupSubscription();

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up message subscription");
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [matchId, setMessages]);
}
