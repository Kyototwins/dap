
import { useEffect, useState } from "react";
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
  messagesLoaded?: boolean;
}

export function MessageContainer({
  matches,
  selectedMatch,
  messages,
  onSelectMatch,
  setMessages,
  messagesLoaded = true,
}: MessageContainerProps) {
  const { showMobileChat, handleBackToList } = useMobileChat(selectedMatch);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Debug log for messages
  useEffect(() => {
    console.log(`MessageContainer: ${messages.length} messages for display`);
    if (messages.length > 0) {
      console.log('First message sample:', messages[0]);
    }
  }, [messages]);

  useEffect(() => {
    // Get current user
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        console.log("Current user authenticated:", data.user.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
          
        setCurrentUser({ ...data.user, profile });
      } else {
        console.log("No authenticated user found");
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
        messagesLoaded={messagesLoaded}
      />
    </div>
  );
}
