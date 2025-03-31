
import { ArrowLeft, MoreVertical, Image, Smile, Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import type { Match, Message } from "@/types/messages";

interface MessageChatProps {
  selectedMatch: Match;
  messages: Message[];
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function MessageChat({
  selectedMatch,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onBack,
}: MessageChatProps) {
  const formatMessageTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "HH:mm");
  };

  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    
    messages.forEach((message) => {
      const messageDate = new Date(message.created_at);
      const dateStr = format(messageDate, "yyyy/MM/dd");
      
      const existingGroup = groups.find((group) => group.date === dateStr);
      
      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        groups.push({ date: dateStr, messages: [message] });
      }
    });
    
    return groups;
  };

  const formatDisplayDate = (dateStr: string) => {
    const messageDate = new Date(dateStr);
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()) {
      return "Yesterday";
    } else {
      return format(messageDate, "MMM d, yyyy");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <Avatar className="h-10 w-10">
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
            <p className="font-semibold">
              {selectedMatch.otherUser.first_name} {selectedMatch.otherUser.last_name}
            </p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages - using fixed height and ScrollArea to contain scrolling */}
      <ScrollArea className="flex-1 px-4">
        <div className="py-4 space-y-6">
          {messageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              <div className="text-center">
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {formatDisplayDate(group.date)}
                </span>
              </div>
              
              {group.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender.id === selectedMatch.otherUser.id ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className="flex flex-col max-w-[75%]">
                    <div
                      className={`${
                        message.sender.id === selectedMatch.otherUser.id
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-500 text-white"
                      } rounded-2xl px-4 py-2`}
                    >
                      <p className="break-words">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 px-2">
                      {formatMessageTime(message.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t p-3">
        <form onSubmit={onSendMessage} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="rounded-full">
            <Image className="h-6 w-6 text-gray-500" />
          </Button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full border-gray-200 rounded-full py-3 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={newMessage}
              onChange={(e) => onNewMessageChange(e.target.value)}
            />
            <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full">
              <Smile className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          
          <Button 
            type="submit" 
            disabled={!newMessage.trim()} 
            size="icon"
            className="bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
