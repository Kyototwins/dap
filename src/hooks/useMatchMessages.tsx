
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
          // Process language_levels to ensure it's the correct type
          let processedLanguageLevels: Record<string, number> = {};
          if (message.sender.language_levels) {
            // If it's a string, try to parse it
            if (typeof message.sender.language_levels === 'string') {
              try {
                processedLanguageLevels = JSON.parse(message.sender.language_levels);
              } catch (e) {
                console.error("Error parsing language_levels:", e);
              }
            } 
            // If it's already an object, cast it to the right type
            else if (typeof message.sender.language_levels === 'object') {
              // Convert any non-number values to numbers where possible
              Object.entries(message.sender.language_levels).forEach(([key, value]) => {
                if (typeof value === 'number') {
                  processedLanguageLevels[key] = value;
                } else if (typeof value === 'string' && !isNaN(Number(value))) {
                  processedLanguageLevels[key] = Number(value);
                }
              });
            }
          }

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
              language_levels: processedLanguageLevels,
              superpower: message.sender.superpower || '',
              learning_languages: message.sender.learning_languages || [],
              photo_comment: message.sender.photo_comment || null,
              worst_nightmare: message.sender.worst_nightmare || null,
              friend_activity: message.sender.friend_activity || null,
              best_quality: message.sender.best_quality || null
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
