
import { useEffect, useState } from "react";
import { useMessageSending } from "@/hooks/useMessageSending";
import { useMobileChat } from "@/hooks/useMobileChat";
import { ChatList } from "@/components/messages/ChatList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { supabase } from "@/integrations/supabase/client";
import type { Match, Message } from "@/types/messages";

interface MessageContainerProps {
  matches: Match[];
  selectedMatch: Match | null;
  messages: Message[];
  onSelectMatch: (match: Match) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function MessageContainer({
  matches,
  selectedMatch,
  messages,
  onSelectMatch,
  setMessages,
}: MessageContainerProps) {
  const { newMessage, setNewMessage, handleSendMessage } = useMessageSending(selectedMatch, messages, setMessages);
  const { showMobileChat, handleBackToList } = useMobileChat(selectedMatch);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
          
        setCurrentUser({ ...data.user, profile });
      }
    };
    
    fetchCurrentUser();
  }, []);

  const handleSendMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch || !newMessage.trim() || !currentUser) return;
    
    try {
      // Use the utility function to send the message
      const result = await handleSendMessage();
      
      // Reset the input
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden border rounded-lg shadow-sm">
      <ChatList 
        matches={matches}
        selectedMatch={selectedMatch}
        onSelectMatch={onSelectMatch}
        showMobileChat={showMobileChat}
      />
      
      <ChatWindow
        match={selectedMatch}
        messages={messages}
        setMessages={setMessages}
        onBack={handleBackToList}
        showMobileChat={showMobileChat}
      />
    </div>
  );
}
