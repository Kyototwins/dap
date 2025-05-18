
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
  
  if (!visibleProfiles || visibleProfiles.length === 0) {
    return <ProfileNotFound message="検索条件に一致するユーザーが見つかりませんでした。" />;
  }
  
  return (
    <div className="grid gap-4 md:gap-6">
      {visibleProfiles.map(profile => (
        <UserCard key={profile.id} profile={profile} />
      ))}
      
      {visibleProfiles.length < filteredProfiles.length && (
        <Button 
          variant="outline" 
          onClick={onLoadMore} 
          disabled={loadingMore} 
          className="w-full py-6 mt-2 border-dashed border-gray-200 text-gray-700 hover:text-gray-900"
        >
          {loadingMore ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              読み込み中...
            </>
          ) : (
            <>もっと表示</>
          )}
        </Button>
      )}
    </div>
  );
}
