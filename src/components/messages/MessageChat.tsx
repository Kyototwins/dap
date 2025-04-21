
import { Send } from "lucide-react";
import { Match, Message } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMessageSending } from "@/hooks/useMessageSending";
import { formatMessageTimestamp } from "@/lib/message-date-utils";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Log messages for debugging
  useEffect(() => {
    console.log(`MessageChat render: ${messages.length} messages available`);
  }, [messages]);

  // Get current user ID when component mounts
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data?.user?.id || null);
    };
    
    getCurrentUser();
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            まだメッセージがありません。会話を始めましょう！
          </p>
        ) : (
          messages.map((message) => {
            // Compare message sender ID with current user ID
            const isCurrentUser = message.sender_id === currentUserId;

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
          })
        )}
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
