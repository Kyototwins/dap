
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Match, Message } from "@/types/messages";

export function useMatchMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const fetchMessages = async (matchId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (*)
        `)
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      console.log("Fetched messages:", data);
      
      const validMessages = (data || [])
        .filter(message => message.sender)
        .map(message => {
          return {
            id: message.id,
            content: message.content,
            created_at: message.created_at,
            match_id: message.match_id,
            sender_id: message.sender_id,
            sender: {
              ...message.sender,
              department: message.sender.department || '',
              year: message.sender.year || '',
              hobbies: message.sender.hobbies || [],
              languages: message.sender.languages || [],
              language_levels: message.sender.language_levels as Record<string, number> || {},
              superpower: message.sender.superpower || '',
              learning_languages: message.sender.learning_languages || [],
              photo_comment: message.sender.photo_comment || null,
              worst_nightmare: message.sender.worst_nightmare || null,
              friend_activity: message.sender.friend_activity || null,
              best_quality: message.sender.best_quality || null,
            }
          };
        });

      setMessages(validMessages);
      return validMessages;
    } catch (error: any) {
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
