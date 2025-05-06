
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export type TimeFilter = 'all' | 'today' | 'this-week' | 'this-month';
export type CategoryFilter = 'all' | 'Sports' | 'Study' | 'Meal' | 'Karaoke' | 'Sightseeing' | 'Other';

interface EventFiltersProps {
  timeFilter: TimeFilter;
  categoryFilter: CategoryFilter;
  onTimeFilterChange: (value: TimeFilter) => void;
  onCategoryFilterChange: (value: CategoryFilter) => void;
  hidePastEvents: boolean;
  onHidePastEventsChange: (value: boolean) => void;
  onCalendarViewClick: () => void;
}

export function EventFilters({ 
  timeFilter, 
  categoryFilter, 
  onTimeFilterChange, 
  onCategoryFilterChange,
  hidePastEvents,
  onHidePastEventsChange,
  onCalendarViewClick
}: EventFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        <FilterButton 
          active={timeFilter === 'all'} 
          onClick={() => onTimeFilterChange('all')}
        >
          All
        </FilterButton>
        <FilterButton 
          active={timeFilter === 'today'} 
          onClick={() => onTimeFilterChange('today')}
        >
          Today
        </FilterButton>
        <FilterButton 
          active={timeFilter === 'this-week'} 
          onClick={() => onTimeFilterChange('this-week')}
        >
          This Week
        </FilterButton>
        <FilterButton 
          active={timeFilter === 'this-month'} 
          onClick={() => onTimeFilterChange('this-month')}
        >
          This Month
        </FilterButton>
      </div>
      
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        <FilterButton 
          active={categoryFilter === 'all'} 
          onClick={() => onCategoryFilterChange('all')}
        >
          All
        </FilterButton>
        <FilterButton 
          active={categoryFilter === 'Sports'} 
          onClick={() => onCategoryFilterChange('Sports')}
        >
          Sports
        </FilterButton>
        <FilterButton 
          active={categoryFilter === 'Study'} 
          onClick={() => onCategoryFilterChange('Study')}
        >
          Study
        </FilterButton>
        <FilterButton 
          active={categoryFilter === 'Meal'} 
          onClick={() => onCategoryFilterChange('Meal')}
        >
          Meal
        </FilterButton>
        <FilterButton 
          active={categoryFilter === 'Karaoke'} 
          onClick={() => onCategoryFilterChange('Karaoke')}
        >
          Karaoke
        </FilterButton>
        <FilterButton 
          active={categoryFilter === 'Sightseeing'} 
          onClick={() => onCategoryFilterChange('Sightseeing')}
        >
          Sightseeing
        </FilterButton>
        <FilterButton 
          active={categoryFilter === 'Other'} 
          onClick={() => onCategoryFilterChange('Other')}
        >
          Other
        </FilterButton>
      </div>
      
      <div className="flex items-center justify-between pt-1">
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
    </div>
  );
}

interface FilterButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function FilterButton({ children, active, onClick }: FilterButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
        active 
          ? "bg-[#7f1184] text-white" 
          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
      }`}
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
