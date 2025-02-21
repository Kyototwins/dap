
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Match } from "@/types/messages";

interface MatchListProps {
  matches: Match[];
  selectedMatch: Match | null;
  onSelectMatch: (match: Match) => void;
}

export function MatchList({ matches, selectedMatch, onSelectMatch }: MatchListProps) {
  return (
    <div className="border-b p-4">
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-4">
          {matches.map((match) => (
            <Card
              key={match.id}
              className={`p-4 cursor-pointer hover:bg-accent transition-colors flex-shrink-0 w-[200px] ${
                selectedMatch?.id === match.id ? "bg-accent" : ""
              }`}
              onClick={() => onSelectMatch(match)}
            >
              <div className="flex flex-col items-center gap-3">
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
                <div className="text-center w-full">
                  <p className="font-medium truncate">
                    {match.otherUser.first_name} {match.otherUser.last_name}
                  </p>
                  {match.lastMessage && (
                    <p className="text-sm text-muted-foreground truncate mt-1">
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
      </div>
    </div>
  );
}
