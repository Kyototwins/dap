
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Match, Message } from "@/types/messages";

export function useMatchMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const fetchMessages = async (matchId: string) => {
    try {
      console.log("Fetching messages for matchId:", matchId);
      
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
            // If it's already an object, safely convert it
            else if (typeof message.sender.language_levels === 'object') {
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
              id: message.sender.id,
              first_name: message.sender.first_name,
              last_name: message.sender.last_name,
              avatar_url: message.sender.avatar_url,
              about_me: message.sender.about_me,
              age: message.sender.age,
              gender: message.sender.gender,
              ideal_date: message.sender.ideal_date,
              image_url_1: message.sender.image_url_1,
              image_url_2: message.sender.image_url_2,
              life_goal: message.sender.life_goal,
              origin: message.sender.origin,
              sexuality: message.sender.sexuality,
              university: message.sender.university,
              department: message.sender.department || '',
              year: message.sender.year || '',
              hobbies: message.sender.hobbies || [],
              languages: message.sender.languages || [],
              language_levels: processedLanguageLevels,
              superpower: message.sender.superpower || '',
              learning_languages: message.sender.learning_languages || [],
              created_at: message.sender.created_at,
              photo_comment: message.sender.photo_comment || null,
              worst_nightmare: message.sender.worst_nightmare || null,
              friend_activity: message.sender.friend_activity || null,
              best_quality: message.sender.best_quality || null
            }
          };
        });
      
      console.log("Processed messages:", validMessages);
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
