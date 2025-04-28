
import { Search } from "lucide-react";
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
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input 
            type="text"
            placeholder="Search Messages..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-sm"
          />
        </div>
      </div>
      <MatchList 
        matches={matches} 
        selectedMatch={selectedMatch} 
        onSelectMatch={onSelectMatch}
      />
    </div>
  );
}
