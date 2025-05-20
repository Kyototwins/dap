
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message, Match } from "@/types/messages";

export function useMessageSending(
  match: Match | null,
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !match || !match.id) {
      return false;
    }

    try {
      setSending(true);
      
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        throw new Error("User not authenticated");
      }
      
      const currentUserId = userData.user.id;
      const receiverId = match.user1_id === currentUserId ? match.user2_id : match.user1_id;
      
      // Create new message in database
      const { data: messageData, error } = await supabase
        .from("messages")
        .insert([
          {
            match_id: match.id,
            sender_id: currentUserId,
            content: newMessage.trim()
          }
        ])
        .select();

      if (error) throw error;

      // Add the new message to the messages state if not added by realtime subscription
      if (messageData && messageData[0]) {
        const newMessageObj: Message = {
          id: messageData[0].id,
          content: messageData[0].content,
          created_at: messageData[0].created_at,
          sender_id: messageData[0].sender_id,
          match_id: messageData[0].match_id,
          receiver_id: receiverId
        };
        
        // Check if message already exists in the list (might have been added by subscription)
        const messageExists = messages.some(msg => msg.id === newMessageObj.id);
        if (!messageExists) {
          setMessages((prevMessages) => [...prevMessages, newMessageObj]);
        }
      }
      
      // Clear input
      setNewMessage("");
      return true;
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
      return false;
    } finally {
      setSending(false);
    }
  };

  return {
    newMessage,
    setNewMessage,
    sending,
    handleContentChange,
    handleSubmit: handleSendMessage,
    handleSendMessage,
    messagesEndRef
  };
}
