
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Match } from "@/types/messages";
import { format } from "date-fns";

interface MatchListProps {
  matches: Match[];
  selectedMatch: Match | null;
  onSelectMatch: (match: Match) => void;
}

export function MatchList({ matches, selectedMatch, onSelectMatch }: MatchListProps) {
  // Format the time relative to now (like "2 hours ago", "just now", etc.)
  const formatTimeAgo = (timestamp: string) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return format(date, "MMM d");
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <ScrollArea className="w-full h-full">
        <div className="flex flex-col p-2 space-y-2">
          {matches.map((match) => (
            <Card
              key={match.id}
              className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                selectedMatch?.id === match.id ? "bg-accent" : ""
              }`}
              onClick={() => onSelectMatch(match)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={match.otherUser.avatar_url || "/placeholder.svg"}
                    alt={`${match.otherUser.first_name}のアバター`}
                  />
                  <AvatarFallback>
                    {match.otherUser.first_name?.[0]}
                    {match.otherUser.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-base truncate">
                      {match.otherUser.first_name} {match.otherUser.last_name}
                    </p>
                    {match.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(match.lastMessage.created_at)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    {match.lastMessage ? (
                      <p className="text-sm text-muted-foreground truncate">
                        {match.lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No messages yet
                      </p>
                    )}
                    {/* Unread badge - would be dynamic in a real app */}
                    {Math.random() > 0.7 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-500">
                        <span className="text-xs">1</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {matches.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              まだマッチしているユーザーがいません
            </p>
          )}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
