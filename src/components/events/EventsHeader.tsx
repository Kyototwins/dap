
import { Search } from "lucide-react";

interface EventsHeaderProps {
  onSearchChange: (searchQuery: string) => void;
}

export function EventsHeader({ onSearchChange }: EventsHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input 
          type="text"
          placeholder="Search events..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-sm"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
