
import { Search, Calendar } from "lucide-react";
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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.startsWith("date:")) {
      onSearchChange(e.target.value);
    }
  };
  return <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full px-3 py-2 pl-10 border border-gray-200 rounded-lg text-sm"
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        {/* Date Filter and Sort Dropdown in one row */}
        <div className="flex space-x-3 w-full md:w-auto">
          <input 
            type="date" 
            value={dateFilter} 
            onChange={handleDateFilterChange} 
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm flex-1 md:flex-none w-full md:w-auto" 
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
      
      <div className="flex items-center space-x-4 mt-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hide-past-events" 
            checked={hidePastEvents} 
            onCheckedChange={checked => onHidePastEventsChange(checked as boolean)} 
          />
          <label htmlFor="hide-past-events" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Hide past events
          </label>
        </div>
        
        <Button variant="outline" size="sm" onClick={onCalendarViewClick} className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>Your schedule</span>
        </Button>
      </div>
    </div>;
}
