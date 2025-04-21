
import { useEffect, useState } from "react";
import { ChatList } from "@/components/messages/ChatList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { useMobileChat } from "@/hooks/useMobileChat";
import type { Match, Message } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";

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
