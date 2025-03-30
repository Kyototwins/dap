
import { useState } from "react";

export type TimeFilter = 'all' | 'today' | 'this-week' | 'this-month';
export type CategoryFilter = 'all' | 'language-exchange' | 'cultural' | 'academic' | 'social' | 'tour';

interface EventFiltersProps {
  timeFilter: TimeFilter;
  categoryFilter: CategoryFilter;
  onTimeFilterChange: (value: TimeFilter) => void;
  onCategoryFilterChange: (value: CategoryFilter) => void;
}

export function EventFilters({ 
  timeFilter, 
  categoryFilter, 
  onTimeFilterChange, 
  onCategoryFilterChange 
}: EventFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        <FilterButton 
          active={timeFilter === 'all'} 
          onClick={() => onTimeFilterChange('all')}
        >
          すべて
        </FilterButton>
        <FilterButton 
          active={timeFilter === 'today'} 
          onClick={() => onTimeFilterChange('today')}
        >
          今日
        </FilterButton>
        <FilterButton 
          active={timeFilter === 'this-week'} 
          onClick={() => onTimeFilterChange('this-week')}
        >
          今週
        </FilterButton>
        <FilterButton 
          active={timeFilter === 'this-month'} 
          onClick={() => onTimeFilterChange('this-month')}
        >
          今月
        </FilterButton>
      </div>
      
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        <FilterButton 
          active={categoryFilter === 'all'} 
          onClick={() => onCategoryFilterChange('all')}
        >
          すべて
        </FilterButton>
        <FilterButton 
          active={categoryFilter === 'language-exchange'} 
          onClick={() => onCategoryFilterChange('language-exchange')}
        >
          言語交換
        </FilterButton>
        <FilterButton 
          active={categoryFilter === 'cultural'} 
          onClick={() => onCategoryFilterChange('cultural')}
        >
          文化体験
        </FilterButton>
        <FilterButton 
          active={categoryFilter === 'academic'} 
          onClick={() => onCategoryFilterChange('academic')}
        >
          学術
        </FilterButton>
        <FilterButton 
          active={categoryFilter === 'social'} 
          onClick={() => onCategoryFilterChange('social')}
        >
          交流会
        </FilterButton>
        <FilterButton 
          active={categoryFilter === 'tour'} 
          onClick={() => onCategoryFilterChange('tour')}
        >
          ツアー
        </FilterButton>
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
          ? "bg-amber-500 text-white" 
          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
