
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <div className="overflow-x-auto pb-2">
        <Tabs value={timeFilter} onValueChange={(value) => onTimeFilterChange(value as TimeFilter)} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">すべて</TabsTrigger>
            <TabsTrigger value="today" className="flex-1">今日</TabsTrigger>
            <TabsTrigger value="this-week" className="flex-1">今週</TabsTrigger>
            <TabsTrigger value="this-month" className="flex-1">今月</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <Tabs value={categoryFilter} onValueChange={(value) => onCategoryFilterChange(value as CategoryFilter)} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">すべて</TabsTrigger>
            <TabsTrigger value="language-exchange" className="flex-1">言語交換</TabsTrigger>
            <TabsTrigger value="cultural" className="flex-1">文化体験</TabsTrigger>
            <TabsTrigger value="academic" className="flex-1">学術</TabsTrigger>
            <TabsTrigger value="social" className="flex-1">交流会</TabsTrigger>
            <TabsTrigger value="tour" className="flex-1">ツアー</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
