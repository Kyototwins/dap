
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { validateMessage, sendMatchMessage, getCurrentUser } from "@/utils/messageSendingUtils";
import type { Match } from "@/types/messages";

export function useMessageSending() {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (e: React.FormEvent, selectedMatch: Match | null, currentUser?: any) => {
    e.preventDefault();
    
    // Return early if validation fails
    if (!validateMessage(newMessage, selectedMatch)) return false;
    
    try {
      setSending(true);
      
      // Get current user if not provided
      const user = currentUser || await getCurrentUser();
      if (!user) {
        toast({
          title: "認証されていません",
          description: "メッセージを送信するにはログインしてください。",
          variant: "destructive",
        });
        return false;
      }
      
      // Extract message content before clearing input
      const messageContent = newMessage.trim();
      
      // Send the message
      const result = await sendMatchMessage(
        selectedMatch!.id,
        user.id,
        messageContent
      );
      
      if (!result.success) {
        throw new Error(result.error || "メッセージの送信に失敗しました");
      }
      
      // Clear the input on successful send
      setNewMessage("");
      
      return result;
    } catch (error: any) {
      toast({
        title: "メッセージの送信に失敗しました",
        description: error.message,
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setSending(false);
    }
  };

  return {
    newMessage,
    setNewMessage,
    sendMessage,
    sending
  };
}
