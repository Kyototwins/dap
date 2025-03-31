import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Match } from "@/types/messages";

interface MatchListProps {
  matches: Match[];
  selectedMatch: Match | null;
  onSelectMatch: (match: Match) => void;
}

export function MatchList({ matches, selectedMatch, onSelectMatch }: MatchListProps) {
  return (
    <div className="w-full h-24 overflow-hidden">
      <ScrollArea className="w-full h-full whitespace-nowrap">
        <div className="flex gap-2 p-4 overflow-y-hidden">
          {matches.map((match) => (
            <Card
              key={match.id}
              className={`shrink-0 p-3 cursor-pointer hover:bg-accent transition-colors w-[140px] ${
                selectedMatch?.id === match.id ? "bg-accent" : ""
              }`}
              onClick={() => onSelectMatch(match)}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={match.otherUser.avatar_url || "/placeholder.svg"}
                    alt={`${match.otherUser.first_name}のアバター`}
                  />
                  <AvatarFallback>
                    {match.otherUser.first_name?.[0]}
                    {match.otherUser.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="font-medium truncate text-sm">
                    {match.otherUser.first_name} {match.otherUser.last_name}
                  </p>
                  {match.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate">
                      {match.lastMessage.content}
                    </p>
                  )}
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
