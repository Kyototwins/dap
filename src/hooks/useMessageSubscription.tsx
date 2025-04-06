
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Match, Message } from "@/types/messages";

export function useMessageSubscription(
  selectedMatch: Match | null, 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  // Set up realtime subscription when the component mounts
  useEffect(() => {
    if (!selectedMatch) return;
    
    // Set up a realtime subscription for the selected match
    const messagesSubscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, async payload => {
        console.log("New message received:", payload.new);
        
        // Get current user for comparison
        const { data: { user } } = await supabase.auth.getUser();
        
        // Only process if relevant to the selected match 
        if (payload.new && 
            (selectedMatch?.id === payload.new.match_id)) {
          
          // Get sender information
          const { data: senderData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.sender_id)
            .single();
          
          if (senderData) {
            console.log("Sender data found:", senderData);
            
            // Process language_levels to ensure it's the correct type
            let processedLanguageLevels: Record<string, number> = {};
            if (senderData.language_levels) {
              // If it's a string, try to parse it
              if (typeof senderData.language_levels === 'string') {
                try {
                  processedLanguageLevels = JSON.parse(senderData.language_levels);
                } catch (e) {
                  console.error("Error parsing language_levels:", e);
                }
              } 
              // If it's already an object, cast it to the right type
              else if (typeof senderData.language_levels === 'object') {
                // Convert any non-number values to numbers where possible
                Object.entries(senderData.language_levels).forEach(([key, value]) => {
                  if (typeof value === 'number') {
                    processedLanguageLevels[key] = value;
                  } else if (typeof value === 'string' && !isNaN(Number(value))) {
                    processedLanguageLevels[key] = Number(value);
                  }
                });
              }
            }
            
            const newMessage: Message = {
              id: payload.new.id,
              content: payload.new.content,
              created_at: payload.new.created_at,
              match_id: payload.new.match_id,
              sender_id: payload.new.sender_id,
              sender: {
                id: senderData.id,
                first_name: senderData.first_name,
                last_name: senderData.last_name,
                avatar_url: senderData.avatar_url,
                about_me: senderData.about_me,
                age: senderData.age,
                gender: senderData.gender,
                ideal_date: senderData.ideal_date,
                image_url_1: senderData.image_url_1,
                image_url_2: senderData.image_url_2,
                life_goal: senderData.life_goal,
                origin: senderData.origin,
                sexuality: senderData.sexuality,
                superpower: senderData.superpower || '',
                university: senderData.university,
                department: senderData.department || '',
                year: senderData.year || '',
                hobbies: senderData.hobbies || [],
                languages: senderData.languages || [],
                language_levels: processedLanguageLevels,
                learning_languages: senderData.learning_languages || [],
                created_at: senderData.created_at,
                photo_comment: senderData.photo_comment || null,
                worst_nightmare: senderData.worst_nightmare || null,
                friend_activity: senderData.friend_activity || null,
                best_quality: senderData.best_quality || null
              }
            };
            
            // Add message if it's for the selected match
            setMessages(prev => {
              // Avoid duplicate messages
              if (prev.some(msg => msg.id === newMessage.id)) {
                return prev;
              }
              return [...prev, newMessage];
            });
          }
        }
      })
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [selectedMatch, setMessages]);
}
