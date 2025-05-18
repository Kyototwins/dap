
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Match } from "@/types/messages";
import { format, formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { useEffect } from "react";

interface MatchListProps {
  matches: Match[];
  selectedMatch: Match | null;
  onSelectMatch: (match: Match) => void;
}

export function MatchList({ matches, selectedMatch, onSelectMatch }: MatchListProps) {
  // Format the message timestamp in a human-readable way
  const formatMessageTime = (timestamp: string) => {
    if (!timestamp) return "";
    
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // If message is from today, show time (e.g., "14:30")
    if (diffInDays === 0) {
      return format(messageDate, "HH:mm");
    }
    
    // If message is from yesterday, show "昨日"
    if (diffInDays === 1) {
      return "昨日";
    }
    
    // If message is from this week, show day of week (e.g., "月")
    if (diffInDays < 7) {
      return format(messageDate, "E", { locale: ja });
    }
    
    // Otherwise show date (e.g., "4/10")
    return format(messageDate, "M/d");
  };

  useEffect(() => {
    console.log(`MatchList rendering with ${matches.length} matches`);
    if (matches.length > 0) {
      console.log('First match sample:', {
        id: matches[0].id,
        user: `${matches[0].otherUser.first_name} ${matches[0].otherUser.last_name}`,
        hasLastMessage: !!matches[0].lastMessage,
        status: matches[0].status
      });
    }
  }, [matches]);

  return (
    <div className="w-full h-full overflow-hidden">
      <ScrollArea className="w-full h-full">
        <div className="flex flex-col p-2 space-y-2">
          {matches.length > 0 ? (
            matches.map((match) => (
              <Card
                key={match.id}
                className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                  selectedMatch?.id === match.id ? "bg-accent" : ""
                }`}
                onClick={() => onSelectMatch(match)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={match.otherUser.avatar_url || "/placeholder.svg"}
                        alt={`${match.otherUser.first_name}のアバター`}
                      />
                      <AvatarFallback>
                        {match.otherUser.first_name?.[0] || '?'}
                        {match.otherUser.last_name?.[0] || ''}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Only show unread badge if there are unread messages */}
                    {match.unreadCount > 0 && (
                      <Badge className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-500">
                        <span className="text-xs">{match.unreadCount}</span>
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium text-base truncate">
                        {match.otherUser.first_name} {match.otherUser.last_name}
                      </p>
                      {match.lastMessage && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-1">
                          {formatMessageTime(match.lastMessage.created_at)}
                        </span>
                      )}
                    </div>
                    <div>
                      {match.lastMessage ? (
                        <p className="text-sm text-muted-foreground truncate">
                          {match.lastMessage.content}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          新しい会話を始めましょう
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              マッチングユーザーがまだ読み込まれていません
            </p>
          )}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
