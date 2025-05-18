
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message, Match } from "@/types/messages";
import { sendMatchMessage } from "@/utils/messageSendingUtils";
import { createStandardizedUserObject } from "@/utils/profileDataUtils";

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
          // Create a standardized sender object
          const sender = createStandardizedUserObject(profileData);
          
          if (sender) {
            // Create a proper Message object with all required fields
            // that conforms to our Message type definition
            const tempMessage: Message = {
              id: result.messageData.id,
              content: result.messageData.content,
              created_at: result.messageData.created_at || new Date().toISOString(),
              sender_id: authData.user.id,
              // Include match_id as an extended property
              match_id: match.id
            };
            
            // Add the message with sender to our local state
            const enhancedMessage = {
              ...tempMessage,
              sender
            };
            
            setMessages(prevMessages => {
              // Check if this message already exists to avoid duplicates
              if (prevMessages.some(msg => msg.id === enhancedMessage.id)) {
                return prevMessages;
              }
              return [...prevMessages, enhancedMessage as unknown as Message];
            });
          }
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
