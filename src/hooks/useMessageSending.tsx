
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message, Match } from "@/types/messages";
import { sendMatchMessage } from "@/utils/messageSendingUtils";

export function useMessageSending(
  match: Match | null,
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !match || sending) return false;

    setSending(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("Not authenticated");
      
      const result = await sendMatchMessage(match.id, authData.user.id, newMessage.trim());
      
      if (result.success && result.messageData) {
        // Get sender profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();
          
        if (profileData) {
          // Process language_levels to ensure it's the correct type
          let processedLanguageLevels: Record<string, number> = {};
          if (profileData.language_levels) {
            // If it's a string, try to parse it
            if (typeof profileData.language_levels === 'string') {
              try {
                processedLanguageLevels = JSON.parse(profileData.language_levels);
              } catch (e) {
                console.error("Error parsing language_levels:", e);
              }
            } 
            // If it's already an object, safely convert it
            else if (typeof profileData.language_levels === 'object') {
              Object.entries(profileData.language_levels).forEach(([key, value]) => {
                if (typeof value === 'number') {
                  processedLanguageLevels[key] = value;
                } else if (typeof value === 'string' && !isNaN(Number(value))) {
                  processedLanguageLevels[key] = Number(value);
                }
              });
            }
          }
          
          // Create a proper Message object
          const tempMessage: Message = {
            id: result.messageData.id,
            content: result.messageData.content,
            created_at: result.messageData.created_at || new Date().toISOString(),
            match_id: result.messageData.match_id,
            sender_id: authData.user.id,
            sender: {
              id: profileData.id,
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              avatar_url: profileData.avatar_url,
              about_me: profileData.about_me,
              age: profileData.age,
              gender: profileData.gender,
              ideal_date: profileData.ideal_date,
              image_url_1: profileData.image_url_1,
              image_url_2: profileData.image_url_2,
              life_goal: profileData.life_goal,
              origin: profileData.origin,
              sexuality: profileData.sexuality,
              superpower: profileData.superpower || '',
              university: profileData.university,
              department: profileData.department || '',
              year: profileData.year || '',
              hobbies: profileData.hobbies || [],
              languages: profileData.languages || [],
              language_levels: processedLanguageLevels,
              learning_languages: profileData.learning_languages || [],
              created_at: profileData.created_at,
              photo_comment: profileData.photo_comment || null,
              worst_nightmare: profileData.worst_nightmare || null,
              friend_activity: profileData.friend_activity || null,
              best_quality: profileData.best_quality || null,
              hobby_photo_url: profileData.hobby_photo_url || null,
              pet_photo_url: profileData.pet_photo_url || null,
              hobby_photo_comment: profileData.hobby_photo_comment || null,
              pet_photo_comment: profileData.pet_photo_comment || null
            }
          };
          
          // Add the message to our local state
          setMessages(prevMessages => {
            // Check if this message already exists to avoid duplicates
            if (prevMessages.some(msg => msg.id === tempMessage.id)) {
              return prevMessages;
            }
            return [...prevMessages, tempMessage];
          });
        }
        
        // Reset the input
        setNewMessage("");
        scrollToBottom();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    } finally {
      setSending(false);
    }
  };

  return {
    newMessage,
    setNewMessage,
    sending,
    handleSendMessage,
    messagesEndRef,
    scrollToBottom
  };
}
