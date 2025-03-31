
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfileFilter } from "@/hooks/useProfileFilter";
import { SearchBar } from "@/components/matches/SearchBar";
import { FilterSheet } from "@/components/matches/FilterSheet";
import { ProfilesList } from "@/components/matches/ProfilesList";

export default function Matches() {
  const {
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
    handleLoadMore,
    handleRefresh,
  } = useProfileFilter();

  return (
    <div className="py-6">
      <div className="mb-6">
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      </div>
      
      <div className="flex items-center justify-end mb-6">
        <div className="flex gap-2">
          <Button 
            size="icon" 
            variant="outline"
            onClick={handleRefresh}
            className="bg-white/70 backdrop-blur-sm border-amber-200"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 text-amber-600 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          
          <FilterSheet 
            filters={filters}
            setFilters={setFilters}
            isOpen={isFilterSheetOpen}
            setIsOpen={setIsFilterSheetOpen}
          />
        </div>
      </div>

      <ProfilesList 
        loading={loading}
        loadingMore={loadingMore}
        filteredProfiles={filteredProfiles}
        visibleProfiles={visibleProfiles}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
