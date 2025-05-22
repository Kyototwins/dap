
import { useState } from "react";
import type { FilterState } from "@/types/matches";

const DEFAULT_FILTER_STATE: FilterState = {
  ageRange: [18, 50],
  speakingLanguages: [],
  learningLanguages: [],
  minLanguageLevel: 1,
  hobbies: [],
  countries: [],
  sortOption: "recent"
};

export function useFilterState() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return {
    filters,
    searchQuery,
    isFilterSheetOpen,
    setFilters,
    setSearchQuery,
    setIsFilterSheetOpen,
    handleSearchChange
  };
}
