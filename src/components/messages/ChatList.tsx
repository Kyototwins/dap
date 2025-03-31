
import { MatchList } from "@/components/messages/MatchList";
import type { Match } from "@/types/messages";

interface ChatListProps {
  matches: Match[];
  selectedMatch: Match | null;
  onSelectMatch: (match: Match) => void;
  showMobileChat: boolean;
}

export function ChatList({
  matches,
  selectedMatch,
  onSelectMatch,
  showMobileChat
}: ChatListProps) {
  return (
    <div className={`${showMobileChat ? 'hidden md:block' : 'w-full'} md:w-1/3 border-r overflow-hidden`}>
      <MatchList 
        matches={matches} 
        selectedMatch={selectedMatch} 
        onSelectMatch={onSelectMatch}
      />
    </div>
  );
}
