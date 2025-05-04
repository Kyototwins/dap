
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SortAsc, TrendingUp, Calendar } from "lucide-react";

export type SortOption = "newest" | "popular" | "date_asc";

interface EventSortOptionsProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function EventSortOptions({ value, onChange }: EventSortOptionsProps) {
  return (
    <div className="flex justify-center mb-4">
      <ToggleGroup type="single" value={value} onValueChange={(val) => val && onChange(val as SortOption)}>
        <ToggleGroupItem value="newest" aria-label="Sort by newest">
          <SortAsc className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Newest</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="popular" aria-label="Sort by popularity">
          <TrendingUp className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Popular</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="date_asc" aria-label="Sort by closest event date">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Upcoming</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
