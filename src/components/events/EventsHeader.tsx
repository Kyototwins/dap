
import { Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption } from "@/components/events/EventSortOptions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface EventsHeaderProps {
  onSearchChange: (searchQuery: string) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  hidePastEvents: boolean;
  onHidePastEventsChange: (value: boolean) => void;
  onCalendarViewClick: () => void;
}

export function EventsHeader({
  onSearchChange,
  sortOption,
  onSortChange,
  hidePastEvents,
  onHidePastEventsChange,
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
          />
          
          <Select value={sortOption} onValueChange={value => onSortChange(value as SortOption)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="date_asc">Upcoming First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
