
import { Send } from "lucide-react";
import { Match, Message } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMessageSending } from "@/hooks/useMessageSending";
import { formatMessageTimestamp } from "@/lib/message-date-utils";
import { supabase } from "@/integrations/supabase/client";

interface MessageChatProps {
  match: Match;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function MessageChat({ match, messages, setMessages }: MessageChatProps) {
  const { 
    newMessage, 
    setNewMessage, 
    sending, 
    handleSendMessage,
    messagesEndRef
  } = useMessageSending(match, messages, setMessages);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const checkIsCurrentUser = async (senderId: string): Promise<boolean> => {
    const { data } = await supabase.auth.getUser();
    return senderId === data?.user?.id;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          // ここで送信者が現在のユーザーかどうかを判定
          const isCurrentUser = message.sender_id === supabase.auth.getUser()?.data?.user?.id;

          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg ${
                  isCurrentUser
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted rounded-bl-none'
                }`}
              >
                <p className="break-words">{message.content}</p>
                <span
                  className={`text-xs block mt-1 ${
                    isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {formatMessageTimestamp(message.created_at)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || sending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
