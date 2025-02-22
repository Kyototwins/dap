
import { Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Match, Message } from "@/types/messages";

interface MessageChatProps {
  selectedMatch: Match;
  messages: Message[];
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

export function MessageChat({ 
  selectedMatch, 
  messages, 
  newMessage, 
  onNewMessageChange, 
  onSendMessage 
}: MessageChatProps) {
  return (
    <div className="h-[calc(90vh-4rem)] flex flex-col relative">
      <div className="h-16 flex-none border-b">
        <div className="flex items-center gap-3 p-4">
          <Avatar>
            <AvatarImage
              src={selectedMatch.otherUser.avatar_url || "/placeholder.svg"}
              alt={`${selectedMatch.otherUser.first_name}のアバター`}
            />
            <AvatarFallback>
              {selectedMatch.otherUser.first_name?.[0]}
              {selectedMatch.otherUser.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {selectedMatch.otherUser.first_name} {selectedMatch.otherUser.last_name}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden mb-20">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              message.sender && (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender.id === selectedMatch.otherUser.id
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.sender.id === selectedMatch.otherUser.id
                        ? "bg-accent"
                        : "bg-primary text-primary-foreground"
                    } rounded-lg p-3`}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="h-20 border-t p-4 bg-background absolute bottom-0 left-0 right-0">
        <form onSubmit={onSendMessage} className="flex gap-2">
          <Input
            type="text"
            placeholder="メッセージを入力..."
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
