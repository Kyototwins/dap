
import { Send } from "lucide-react";
import { Match, Message } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMessageSending } from "@/hooks/useMessageSending";
import { formatMessageTimestamp } from "@/lib/message-date-utils";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";

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
    handleContentChange,
    handleSendMessage,
    messagesEndRef
  } = useMessageSending(match, messages, setMessages);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Log messages for debugging
  useEffect(() => {
    console.log(`MessageChat render: ${messages.length} messages available`);
    if (messages.length > 0) {
      console.log('First message sample:', {
        id: messages[0].id,
        sender: messages[0].sender_id,
        content: messages[0].content?.substring(0, 30),
        time: messages[0].created_at
      });
    }
    
    // Scroll to bottom when messages change or component mounts
    scrollToBottom();
  }, [messages]);

  // Scroll to the bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Get current user ID when component mounts
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Error getting current user:", error);
          return;
        }
        
        if (data?.user) {
          console.log("Current user ID set:", data.user.id);
          setCurrentUserId(data.user.id);
        } else {
          console.log("No authenticated user found");
        }
      } catch (err) {
        console.error("Error in getCurrentUser:", err);
      }
    };
    
    getCurrentUser();
    
    // Scroll to bottom when match changes
    scrollToBottom();
  }, [match?.id]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
            No messages yet. Start a conversation!
          </p>
        ) : (
          messages.map((message) => {
            // Compare message sender ID with current user ID
            const isCurrentUser = message.sender_id === currentUserId;
            
            if (!message.id) {
              console.warn("Message missing ID:", message);
              return null;
            }

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
          <Textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            className="flex-1 min-h-[40px] resize-none"
            rows={1}
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
