
import { useState } from "react";

export type TimeFilter = 'all' | 'today' | 'this-week' | 'this-month';
export type CategoryFilter = 'all' | 'スポーツ' | '勉強会' | '食事会' | 'カラオケ' | '観光' | 'その他';

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
          active={categoryFilter === 'スポーツ'} 
          onClick={() => onCategoryFilterChange('スポーツ')}
        >
          スポーツ
        </FilterButton>
        <FilterButton 
          active={categoryFilter === '勉強会'} 
          onClick={() => onCategoryFilterChange('勉強会')}
        >
          勉強会
        </FilterButton>
        <FilterButton 
          active={categoryFilter === '食事会'} 
          onClick={() => onCategoryFilterChange('食事会')}
        >
          食事会
        </FilterButton>
        <FilterButton 
          active={categoryFilter === 'カラオケ'} 
          onClick={() => onCategoryFilterChange('カラオケ')}
        >
          カラオケ
        </FilterButton>
        <FilterButton 
          active={categoryFilter === '観光'} 
          onClick={() => onCategoryFilterChange('観光')}
        >
          観光
        </FilterButton>
        <FilterButton 
          active={categoryFilter === 'その他'} 
          onClick={() => onCategoryFilterChange('その他')}
        >
          その他
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
          ? "bg-doshisha-purple text-white" 
          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
