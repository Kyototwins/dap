
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Message } from "@/types/messages";
import { createStandardizedUserObject } from "@/utils/profileDataUtils";

export function useMatchMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const fetchMessages = async (matchId: string) => {
    try {
      console.log(`Fetching messages for match: ${matchId}`);
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (*)
        `)
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }
      
      console.log(`Received ${data?.length || 0} messages from database`);
      
      const validMessages = (data || [])
        .filter(message => message.sender)
        .map(message => {
          // Create sender with all required properties
          const sender = createStandardizedUserObject(message.sender);
          
          if (!sender) return null;
          
          // Create a message object that conforms to the Message type
          const messageObj: Message = {
            id: message.id,
            content: message.content,
            created_at: message.created_at,
            sender_id: message.sender_id,
            match_id: message.match_id,
            // Include receiver_id but it might be undefined in the database
            receiver_id: undefined
          };
          
          // Add sender object as a non-interface property
          const enhancedMessage = {
            ...messageObj,
            sender: sender
          };
          
          return enhancedMessage;
        })
        .filter(Boolean) as Message[];

      console.log(`Processed ${validMessages.length} valid messages`);
      setMessages(validMessages as Message[]);
      
      // Return the messages so they can be used by the caller
      return validMessages;
    } catch (error: any) {
      console.error("Error in fetchMessages:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    messages,
    setMessages,
    fetchMessages
  };
}
