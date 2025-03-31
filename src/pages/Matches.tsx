
import { RefreshCw, Filter } from "lucide-react";
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
    <div className="py-4">
      <div className="mb-4">
        <div className="relative">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Search by name, language, interest...</h2>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setIsFilterSheetOpen(true)}
            className="border-gray-200 gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          
          <Button 
            size="icon" 
            variant="outline"
            onClick={handleRefresh}
            className="border-gray-200"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <ProfilesList 
        loading={loading}
        loadingMore={loadingMore}
        filteredProfiles={filteredProfiles}
        visibleProfiles={visibleProfiles}
        onLoadMore={handleLoadMore}
      />

      <FilterSheet 
        filters={filters}
        setFilters={setFilters}
        isOpen={isFilterSheetOpen}
        setIsOpen={setIsFilterSheetOpen}
      />
    </div>
  );
}
