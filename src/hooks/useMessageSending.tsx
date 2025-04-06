
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message, Match } from "@/types/messages";
import { formatMessageTimestamp } from "@/lib/message-date-utils";

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
    if (!newMessage.trim() || !match || sending) return;

    setSending(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          match_id: match.id,
          sender_id: authData.user.id,
          content: newMessage.trim()
        })
        .select('*, sender:profiles(*)');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setMessages(prev => [...prev, data[0]]);
        setNewMessage("");
        scrollToBottom();
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
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
