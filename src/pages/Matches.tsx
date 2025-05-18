
import { useState, useEffect } from "react";
import { RefreshCw, Filter, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfileFilter } from "@/hooks/useProfileFilter";
import { SearchBar } from "@/components/matches/SearchBar";
import { FilterSheet } from "@/components/matches/FilterSheet";
import { ProfilesList } from "@/components/matches/ProfilesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLikesReceived } from "@/hooks/useLikesReceived";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationType } from "@/types/notifications";
import { toast } from "@/hooks/use-toast";

export default function Matches() {
  const [activeTab, setActiveTab] = useState("discover");
  const [initialLoad, setInitialLoad] = useState(true);
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

  const { notifications, markAllAsRead } = useNotifications();

  // Debug information
  useEffect(() => {
    console.log("Matches page rendered", {
      profilesCount: filteredProfiles.length,
      visibleCount: visibleProfiles.length,
      isLoading: loading,
      activeTab
    });
    
    // After initial render, set initial load to false
    if (initialLoad) {
      setTimeout(() => {
        setInitialLoad(false);
      }, 500);
    }
  }, [filteredProfiles, visibleProfiles, loading, activeTab, initialLoad]);

  // Force refresh of profiles once when component mounts
  useEffect(() => {
    const performInitialRefresh = async () => {
      try {
        console.log("Performing initial profile refresh");
        await handleRefresh();
      } catch (error) {
        console.error("Error refreshing profiles:", error);
        toast({
          title: "エラー",
          description: "プロフィールの更新に失敗しました",
          variant: "destructive",
        });
      }
    };
    
    performInitialRefresh();
  }, [handleRefresh]);

  // Mark match notifications as read when viewing the likes tab
  useEffect(() => {
    if (activeTab === "likes") {
      const matchNotifications = notifications.filter(
        n => n.type === NotificationType.NEW_MATCH && !n.read
      );
      
      if (matchNotifications.length > 0) {
        console.log("Marking like notifications as read");
        markAllAsRead();
      }
    }
  }, [activeTab, notifications, markAllAsRead]);

  if (initialLoad || loading) {
    return (
      <div className="py-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-doshisha-purple mb-4"></div>
          <p className="text-gray-500">プロフィールを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Tabs defaultValue="discover" className="w-full mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="likes" className="flex items-center gap-2">
            <Heart className="w-4 h-4" /> Likes Received
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
