
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input 
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="名前、言語、趣味などで検索..."
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-white"
      />
    </div>
  );
}
