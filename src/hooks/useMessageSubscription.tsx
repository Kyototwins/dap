
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Match, Message } from "@/types/messages";

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
              // If it's already an object, safely convert it
              else if (typeof senderData.language_levels === 'object') {
                Object.entries(senderData.language_levels).forEach(([key, value]) => {
                  if (typeof value === 'number') {
                    processedLanguageLevels[key] = value;
                  } else if (typeof value === 'string' && !isNaN(Number(value))) {
                    processedLanguageLevels[key] = Number(value);
                  }
                });
              }
            }
            
            // Create sender with all required properties
            const senderWithRequiredProps = {
              id: senderData.id,
              first_name: senderData.first_name || 'ユーザー',
              last_name: senderData.last_name || '',
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
              best_quality: senderData.best_quality || null,
              hobby_photo_url: null,
              pet_photo_url: null,
              hobby_photo_comment: null,
              pet_photo_comment: null
            };
            
            const newMessage: Message = {
              id: payload.new.id,
              content: payload.new.content,
              created_at: payload.new.created_at,
              match_id: payload.new.match_id,
              sender_id: payload.new.sender_id,
              sender: senderWithRequiredProps
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
