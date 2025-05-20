
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";

export function useMatchMessages(matchId: string, currentUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (matchId) {
      fetchMessages();
    }
  }, [matchId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          match_id,
          sender_id,
          sender:profiles!sender_id(*)
        `)
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Convert the data to the required Message format
      const formattedMessages = data.map((message): Message => ({
        id: message.id,
        content: message.content,
        created_at: message.created_at,
        sender_id: message.sender_id,
        receiver_id: '', // Add empty receiver_id to satisfy the type
        match_id: message.match_id
      }));

      setMessages(formattedMessages);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { messages, setMessages, loading, fetchMessages };
}
