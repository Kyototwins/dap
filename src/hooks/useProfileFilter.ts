
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProfileFiltering } from "./filters/useProfileFiltering";
import { usePagination } from "./filters/usePagination";
import { useFilterState } from "./filters/useFilterState";
import { fetchProfiles } from "./filters/fetchProfiles";
import type { Profile } from "@/types/messages";

export function useProfileFilter() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
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

  // Use React Query to fetch profiles
  const { isLoading: loading, refetch } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => fetchProfiles(),
    onSettled: (data) => {
      if (data) {
        setProfiles(data);
        const filteredResults = applyFilters(data, searchQuery, filters);
        setFilteredProfiles(filteredResults);
        resetPagination(filteredResults);
      }
    }
  });

  // Apply filters when they change
  useEffect(() => {
    if (profiles.length > 0) {
      const filteredResults = applyFilters(profiles, searchQuery, filters);
      setFilteredProfiles(filteredResults);
      resetPagination(filteredResults);
    }
  }, [searchQuery, filters]);

  // Refresh data handler
  const handleRefresh = () => {
    refetch();
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
