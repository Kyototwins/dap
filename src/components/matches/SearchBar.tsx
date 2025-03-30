
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder="名前、大学、自己紹介で検索..."
        value={searchQuery}
        onChange={onSearchChange}
        className="pl-10 border-amber-200 focus-visible:ring-amber-500 bg-white/70 backdrop-blur-sm"
      />
    </div>
  );
}
