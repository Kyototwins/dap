
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
          
          return {
            id: message.id,
            content: message.content,
            created_at: message.created_at,
            match_id: message.match_id,
            sender_id: message.sender_id,
            sender: sender
          };
        })
        .filter(Boolean) as Message[];

      console.log(`Processed ${validMessages.length} valid messages`);
      setMessages(validMessages);
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
