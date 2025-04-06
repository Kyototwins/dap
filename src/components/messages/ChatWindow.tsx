
import { MessageChat } from "@/components/messages/MessageChat";
import type { Match, Message } from "@/types/messages";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  match: Match | null;
  messages: Message[];
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onBack: () => void;
  showMobileChat: boolean;
}

export function ChatWindow({
  match,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onBack,
  showMobileChat
}: ChatWindowProps) {
  return (
    <div className={`${!showMobileChat ? 'hidden md:block' : 'w-full'} md:w-2/3 overflow-hidden`}>
      {match ? (
        <div className="h-full flex flex-col">
          <div className="border-b p-3">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={onBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h3 className="font-medium">
                  {match.otherUser.first_name} {match.otherUser.last_name}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <MessageChat
              match={match}
              messages={messages}
              setMessages={() => {}} // We'll handle updates at the parent level
            />
          </div>
          
          <div className="p-3 border-t">
            <form onSubmit={onSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => onNewMessageChange(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Type a message..."
              />
              <Button type="submit" disabled={!newMessage.trim()}>
                Send
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          <p>メッセージを表示するには、左のリストからユーザーを選択してください</p>
        </div>
      )}
    </div>
  );
}
