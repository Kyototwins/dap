
import { useMessageSending } from "@/hooks/useMessageSending";
import { useMobileChat } from "@/hooks/useMobileChat";
import { ChatList } from "@/components/messages/ChatList";
import { ChatWindow } from "@/components/messages/ChatWindow";
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

  const handleSendMessage = (e: React.FormEvent) => {
    sendMessage(e, selectedMatch);
  };

  return (
    <div className="flex h-full overflow-hidden">
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
