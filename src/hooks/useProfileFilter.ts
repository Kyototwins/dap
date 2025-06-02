
import { useState, useEffect } from "react";
import type { FilterState } from "@/types/matches";
import { useProfileFetch } from "./matches/useProfileFetch";
import { useProfileFiltering } from "./matches/useProfileFiltering";
import { useProfilePagination } from "./matches/useProfilePagination";

export function useProfileFilter() {
  const [filteredProfiles, setFilteredProfiles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  // Filter states - default to random sorting
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [18, 50],
    speakingLanguages: [],
    learningLanguages: [],
    minLanguageLevel: 1,
    hobbies: [],
    countries: [],
    sortOption: "random"
  });

  const { profiles, loading, currentUserOrigin, fetchProfiles } = useProfileFetch();
  const { applyFilters, applySorting } = useProfileFiltering();
  const { visibleProfiles, loadingMore, resetPagination, handleLoadMore } = useProfilePagination();

  // Apply filters and sorting
  const processProfiles = (data: any[], query: string, filterState: FilterState) => {
    const filtered = applyFilters(data, query, filterState, currentUserOrigin);
    const sorted = applySorting(filtered, filterState, currentUserOrigin);
    
    setFilteredProfiles(sorted);
    resetPagination(sorted);
  };

  // Initial load
  useEffect(() => {
    fetchProfiles();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (profiles.length > 0) {
      processProfiles(profiles, searchQuery, filters);
    }
  }, [searchQuery, filters, currentUserOrigin, profiles]);

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Refresh data handler
  const handleRefresh = () => {
    fetchProfiles();
  };

  return {
    profiles,
    filteredProfiles,
    visibleProfiles,
    loading,
    loadingMore,
    searchQuery,
    filters,
    isFilterSheetOpen,
    setFilters,
    setIsFilterSheetOpen,
    handleSearchChange,
    handleLoadMore: () => handleLoadMore(filteredProfiles),
    handleRefresh,
  };
}
