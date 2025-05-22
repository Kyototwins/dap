
import { useState, useEffect } from "react";
import { useProfileFetching } from "./filters/useProfileFetching";
import { useProfileFiltering } from "./filters/useProfileFiltering";
import { usePagination } from "./filters/usePagination";
import { useFilterState } from "./filters/useFilterState";
import type { Profile } from "@/types/messages";

export function useProfileFilter() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const { loading, fetchProfiles } = useProfileFetching();
  const { filteredProfiles, setFilteredProfiles, applyFilters } = useProfileFiltering();
  const { visibleProfiles, loadingMore, resetPagination, handleLoadMore } = usePagination(10);
  const { 
    filters, 
    searchQuery, 
    isFilterSheetOpen, 
    setFilters, 
    setIsFilterSheetOpen, 
    handleSearchChange 
  } = useFilterState();

  // Initial load
  useEffect(() => {
    fetchProfiles(setProfiles, applyFilters, searchQuery, filters);
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (profiles.length > 0) {
      const filteredResults = applyFilters(profiles, searchQuery, filters);
      resetPagination(filteredResults);
    }
  }, [searchQuery, filters]);

  // Refresh data handler
  const handleRefresh = () => {
    fetchProfiles(setProfiles, applyFilters, searchQuery, filters);
  };

  // Load more handler
  const loadMore = () => {
    handleLoadMore(filteredProfiles);
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
    handleLoadMore: loadMore,
    handleRefresh,
  };
}
