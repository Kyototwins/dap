
import { RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfileFilter } from "@/hooks/useProfileFilter";
import { SearchBar } from "@/components/matches/SearchBar";
import { FilterSheet } from "@/components/matches/FilterSheet";
import { ProfilesList } from "@/components/matches/ProfilesList";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";

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

      <div className="relative mb-6">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="ml-1">
            <CarouselItem className="basis-auto pl-1">
              <Button 
                size="sm" 
                variant="secondary" 
                className="rounded-full bg-doshisha-purple text-white hover:bg-doshisha-darkPurple whitespace-nowrap"
              >
                All
              </Button>
            </CarouselItem>
            <CarouselItem className="basis-auto pl-1">
              <Button size="sm" variant="outline" className="rounded-full border-gray-200 whitespace-nowrap">
                Recommended
              </Button>
            </CarouselItem>
            <CarouselItem className="basis-auto pl-1">
              <Button size="sm" variant="outline" className="rounded-full border-gray-200 whitespace-nowrap">
                Language Match
              </Button>
            </CarouselItem>
            <CarouselItem className="basis-auto pl-1">
              <Button size="sm" variant="outline" className="rounded-full border-gray-200 whitespace-nowrap">
                Shared Interests
              </Button>
            </CarouselItem>
            <CarouselItem className="basis-auto pl-1">
              <Button size="sm" variant="outline" className="rounded-full border-gray-200 whitespace-nowrap">
                Recently Active
              </Button>
            </CarouselItem>
            <CarouselItem className="basis-auto pl-1">
              <Button size="sm" variant="outline" className="rounded-full border-gray-200 whitespace-nowrap">
                New Users
              </Button>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-0 bg-white/80 backdrop-blur-sm hover:bg-white" />
          <CarouselNext className="right-0 bg-white/80 backdrop-blur-sm hover:bg-white" />
        </Carousel>
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
