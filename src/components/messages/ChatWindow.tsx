
import { MessageChat } from "@/components/messages/MessageChat";
import type { Match, Message } from "@/types/messages";

interface ChatWindowProps {
  selectedMatch: Match | null;
  messages: Message[];
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onBack: () => void;
  showMobileChat: boolean;
}

export function ChatWindow({
  selectedMatch,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onBack,
  showMobileChat
}: ChatWindowProps) {
  return (
    <div className={`${!showMobileChat ? 'hidden md:block' : 'w-full'} md:w-2/3 overflow-hidden`}>
      {selectedMatch ? (
        <MessageChat
          selectedMatch={selectedMatch}
          messages={messages}
          newMessage={newMessage}
          onNewMessageChange={onNewMessageChange}
          onSendMessage={onSendMessage}
          onBack={onBack}
        />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          <p>メッセージを表示するには、左のリストからユーザーを選択してください</p>
        </div>
      )}
    </div>
  );
}
