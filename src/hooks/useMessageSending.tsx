
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Match, Message } from "@/types/messages";

export function useMessageSending() {
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const sendMessage = async (e: React.FormEvent, selectedMatch: Match | null, currentUser?: any) => {
    e.preventDefault();
    if (!selectedMatch || !newMessage.trim()) return false;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      // For immediate UI update we can return the content right away
      const messageContent = newMessage.trim();
      
      const { error, data } = await supabase
        .from("messages")
        .insert([
          {
            match_id: selectedMatch.id,
            sender_id: user.id,
            content: messageContent,
          },
        ])
        .select();

      if (error) throw error;
      
      console.log("Message sent successfully:", data);
      setNewMessage("");
      return true;
    } catch (error: any) {
      toast({
        title: "メッセージの送信に失敗しました",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    newMessage,
    setNewMessage,
    sendMessage
  };
}
