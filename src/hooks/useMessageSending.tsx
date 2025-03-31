
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Match } from "@/types/messages";

export function useMessageSending() {
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const sendMessage = async (e: React.FormEvent, selectedMatch: Match | null) => {
    e.preventDefault();
    if (!selectedMatch || !newMessage.trim()) return false;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      const { error } = await supabase
        .from("messages")
        .insert([
          {
            match_id: selectedMatch.id,
            sender_id: user.id,
            content: newMessage.trim(),
          },
        ]);

      if (error) throw error;
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
