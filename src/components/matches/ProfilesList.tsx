import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserCard } from "@/components/profile/UserCard";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import type { Profile } from "@/types/messages";
interface ProfilesListProps {
  loading: boolean;
  loadingMore: boolean;
  filteredProfiles: Profile[];
  visibleProfiles: Profile[];
  onLoadMore: () => void;
}
export function ProfilesList({
  loading,
  loadingMore,
  filteredProfiles,
  visibleProfiles,
  onLoadMore
}: ProfilesListProps) {
  if (loading) {
    return <ProfileLoading />;
  }
  if (visibleProfiles.length === 0) {
    return <ProfileNotFound message="No users matched your search." />;
  }
  return <div className="grid gap-4 md:gap-6">
      {visibleProfiles.map(profile => <UserCard key={profile.id} profile={profile} />)}
      
      {visibleProfiles.length < filteredProfiles.length && <Button variant="outline" onClick={onLoadMore} disabled={loadingMore} className="w-full py-6 mt-2 border-dashed border-[#7f1184] bg-accent-DEFAULT text-accent-DEFAULT">
          {loadingMore ? <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </> : <>Show More</>}
        </Button>}
    </div>;
}