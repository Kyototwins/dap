import { FilterButton } from "../ui/FilterButton";
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
  return <div className="space-y-3">
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        <FilterButton active={timeFilter === 'all'} onClick={() => onTimeFilterChange('all')}>
          All
        </FilterButton>
        <FilterButton active={timeFilter === 'today'} onClick={() => onTimeFilterChange('today')}>
          Today
        </FilterButton>
        <FilterButton active={timeFilter === 'this-week'} onClick={() => onTimeFilterChange('this-week')}>
          This Week
        </FilterButton>
        <FilterButton active={timeFilter === 'this-month'} onClick={() => onTimeFilterChange('this-month')}>
          This Month
        </FilterButton>
      </div>
      
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        <FilterButton active={categoryFilter === 'all'} onClick={() => onCategoryFilterChange('all')}>
          All
        </FilterButton>
        <FilterButton active={categoryFilter === 'Sports'} onClick={() => onCategoryFilterChange('Sports')}>
          Sports
        </FilterButton>
        <FilterButton active={categoryFilter === 'Study'} onClick={() => onCategoryFilterChange('Study')}>
          Study
        </FilterButton>
        <FilterButton active={categoryFilter === 'Meal'} onClick={() => onCategoryFilterChange('Meal')}>
          Meal
        </FilterButton>
        <FilterButton active={categoryFilter === 'Karaoke'} onClick={() => onCategoryFilterChange('Karaoke')}>
          Karaoke
        </FilterButton>
        <FilterButton active={categoryFilter === 'Sightseeing'} onClick={() => onCategoryFilterChange('Sightseeing')}>
          Sightseeing
        </FilterButton>
        <FilterButton active={categoryFilter === 'Other'} onClick={() => onCategoryFilterChange('Other')}>
          Other
        </FilterButton>
      </div>
      
      
    </div>;
}