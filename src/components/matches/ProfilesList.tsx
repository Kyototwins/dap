
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
    return <ProfileNotFound message="条件に一致するユーザーが見つかりませんでした" />;
  }

  return (
    <div className="grid gap-4 md:gap-6">
      {visibleProfiles.map((profile) => (
        <UserCard key={profile.id} profile={profile} />
      ))}
      
      {visibleProfiles.length < filteredProfiles.length && (
        <Button
          variant="outline"
          className="w-full py-6 mt-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50"
          onClick={onLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              読み込み中...
            </>
          ) : (
            <>さらに表示</>
          )}
        </Button>
      )}
    </div>
  );
}
