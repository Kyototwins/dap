
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
  const { newMessage, setNewMessage, sendMessage } = useMessageSending();
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

  const handleSendMessage = async (e: React.FormEvent) => {
    const success = await sendMessage(e, selectedMatch, currentUser);
    
    // If we have the current user and message was sent successfully, we can add it to the UI immediately
    // Note: The realtime subscription should handle this too, but this gives immediate feedback
    if (success && currentUser && selectedMatch) {
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        content: newMessage,
        created_at: new Date().toISOString(),
        match_id: selectedMatch.id,
        sender_id: currentUser.id,
        sender: currentUser.profile
      };
      
      // Only add to UI if not already added by realtime subscription
      setMessages(prev => {
        if (!prev.some(msg => msg.content === newMessage && 
                          Date.now() - new Date(msg.created_at).getTime() < 2000)) {
          return [...prev, tempMessage];
        }
        return prev;
      });
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
        selectedMatch={selectedMatch}
        messages={messages}
        newMessage={newMessage}
        onNewMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        onBack={handleBackToList}
        showMobileChat={showMobileChat}
      />
    </div>
  );
}
