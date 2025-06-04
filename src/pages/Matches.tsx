import { useState, useEffect } from "react";
import { RefreshCw, Filter, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfileFilter } from "@/hooks/useProfileFilter";
import { SearchBar } from "@/components/matches/SearchBar";
import { FilterSheet } from "@/components/matches/FilterSheet";
import { ProfilesList } from "@/components/matches/ProfilesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLikesReceived } from "@/hooks/useLikesReceived";
import { useUnreadCounts } from "@/hooks/useUnreadCounts";

export default function Matches() {
  const [activeTab, setActiveTab] = useState("discover");
  const { unreadMatches, refreshCounts } = useUnreadCounts();
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

  const {
    likedProfiles,
    loading: likesLoading,
    loadMoreLikes,
    loadingMoreLikes,
    refreshLikes
  } = useLikesReceived();

  // Clear unread matches when switching to likes tab
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "likes" && unreadMatches > 0) {
      // Refresh counts to clear the notification
      setTimeout(() => {
        refreshCounts();
      }, 1000); // Small delay to allow UI to update
    }
  };

  return (
    <div className="py-4">
      <Tabs defaultValue="discover" className="w-full mb-6" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="likes" className="flex items-center gap-2 relative">
            <Heart className="w-4 h-4" /> 
            Likes Received
            {unreadMatches > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadMatches > 9 ? '9+' : unreadMatches}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="discover" className="mt-4">
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
        </TabsContent>
        
        <TabsContent value="likes" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">They want to be friends!</h2>
            <Button 
              size="icon" 
              variant="outline"
              onClick={refreshLikes}
              className="border-gray-200"
              disabled={likesLoading}
            >
              <RefreshCw className={`h-4 w-4 ${likesLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <ProfilesList 
            loading={likesLoading}
            loadingMore={loadingMoreLikes}
            filteredProfiles={likedProfiles}
            visibleProfiles={likedProfiles}
            onLoadMore={loadMoreLikes}
          />
        </TabsContent>
      </Tabs>

      <FilterSheet 
        filters={filters}
        setFilters={setFilters}
        isOpen={isFilterSheetOpen}
        setIsOpen={setIsFilterSheetOpen}
      />
    </div>
  );
}
