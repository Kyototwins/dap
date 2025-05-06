
import { useState } from "react";
import { SortOption } from "@/components/events/EventSortOptions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventsHeaderProps {
  onSearchChange: (searchQuery: string) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  onCalendarViewClick: () => void;
}

export function EventsHeader({
  onSearchChange,
  sortOption,
  onSortChange,
  onCalendarViewClick
}: EventsHeaderProps) {
  const [dateFilter, setDateFilter] = useState<string>("");
  
  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
    // Pass the date filter to the parent component through search
    // We'll parse this date in the filtering function
    onSearchChange(`date:${e.target.value}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Date Filter and Sort Dropdown in one row */}
        <div className="flex space-x-3 w-full">
          <input 
            type="date" 
            value={dateFilter} 
            onChange={handleDateFilterChange} 
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm flex-1" 
            aria-label="Filter by date"
          />
          
          <Select value={sortOption} onValueChange={value => onSortChange(value as SortOption)}>
            <SelectTrigger className="w-[120px]" aria-label="Sort by">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="date_asc">Date (Ascending)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
