
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Match } from "@/types/messages";

interface MatchListProps {
  matches: Match[];
  selectedMatch: Match | null;
  onSelectMatch: (match: Match) => void;
}

export function MatchList({ matches, selectedMatch, onSelectMatch }: MatchListProps) {
  return (
    <ScrollArea className="h-24 w-full whitespace-nowrap overflow-y-hidden">
      <div className="flex gap-2 p-4">
        {matches.map((match) => (
          <Card
            key={match.id}
            className={`shrink-0 p-4 cursor-pointer hover:bg-accent transition-colors w-[200px] ${
              selectedMatch?.id === match.id ? "bg-accent" : ""
            }`}
            onClick={() => onSelectMatch(match)}
          >
            <div className="flex items-center gap-3">
              <Avatar>
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
                <p className="font-medium truncate">
                  {match.otherUser.first_name} {match.otherUser.last_name}
                </p>
                {match.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">
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
    </ScrollArea>
  );
}
