
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";
import { sendDirectMessage } from "@/utils/messageSendingUtils";

export function useMessageSending(
  matchId: string | null,
  currentUserId: string | null,
  receiverId: string | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || !matchId || !currentUserId || !receiverId) {
      return;
    }

    try {
      setSending(true);

      const newMessage = {
        content,
        match_id: matchId,
        sender_id: currentUserId,
        receiver_id: receiverId
      };

      const messageResponse = await sendDirectMessage(newMessage);

      if (messageResponse.error) throw messageResponse.error;

      // Add the new message to the UI
      if (messageResponse.data) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: messageResponse.data.id,
            content: messageResponse.data.content,
            created_at: messageResponse.data.created_at,
            sender_id: messageResponse.data.sender_id,
            receiver_id: messageResponse.data.receiver_id || "",
            match_id: messageResponse.data.match_id
          },
        ]);
      }

      // Clear the input field
      setContent("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return {
    content,
    sending,
    handleContentChange,
    handleSubmit,
  };
}
