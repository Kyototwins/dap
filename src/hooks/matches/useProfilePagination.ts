
import { useState, useRef } from "react";
import type { Profile } from "@/types/messages";

export function useProfilePagination(pageSize: number = 10) {
  const [visibleProfiles, setVisibleProfiles] = useState<Profile[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);

  const resetPagination = (profiles: Profile[]) => {
    pageRef.current = 1;
    setVisibleProfiles(profiles.slice(0, pageSize));
  };

  const handleLoadMore = (filteredProfiles: Profile[]) => {
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    const start = (nextPage - 1) * pageSize;
    const end = nextPage * pageSize;
    
    setTimeout(() => {
      setVisibleProfiles(prev => [
        ...prev, 
        ...filteredProfiles.slice(start, end)
      ]);
      pageRef.current = nextPage;
      setLoadingMore(false);
    }, 500);
  };

  return {
    visibleProfiles,
    loadingMore,
    resetPagination,
    handleLoadMore
  };
}
