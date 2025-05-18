
import { useEffect, useState } from "react";
import { Profile } from "@/types/messages";
import { fetchUserStats, UserStats } from "@/services/profileStatsService";
import { UserAboutSection } from "./user-sections/UserAboutSection";
import { UserPhotoSection } from "./user-sections/UserPhotoSection";
import { UserBasicInfoSection } from "./user-sections/UserBasicInfoSection";
import { UserLanguagesSection } from "./user-sections/UserLanguagesSection";
import { UserLearningLanguagesSection } from "./user-sections/UserLearningLanguagesSection";
import { UserHobbiesSection } from "./user-sections/UserHobbiesSection";
import { UserMoreAboutSection } from "./user-sections/UserMoreAboutSection";
import { UserStatsSection } from "./user-sections/UserStatsSection";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

interface UserProfileAboutTabProps {
  profile: Profile;
}

export function UserProfileAboutTab({ profile }: UserProfileAboutTabProps) {
  const [stats, setStats] = useState<UserStats>({
    connectionsCount: 0,
    eventsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Check if the current profile belongs to the logged in user
  const isCurrentUserProfile = user?.id === profile.id;

  useEffect(() => {
    const loadStats = async () => {
      if (profile.id && isCurrentUserProfile) {
        const userStats = await fetchUserStats(profile.id);
        setStats(userStats);
      }
      setLoading(false);
    };
    
    loadStats();
  }, [profile.id, isCurrentUserProfile]);

  return (
    <div className="space-y-6">
      <UserAboutSection profile={profile} />
      <UserPhotoSection profile={profile} />
      <UserBasicInfoSection profile={profile} />
      <UserLanguagesSection profile={profile} />
      <UserLearningLanguagesSection profile={profile} title="Learning Languages" />
      
      {/* Hobby Photo Section */}
      {profile.hobby_photo_url && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-4">My Hobby Photo</h3>
            <div className="overflow-hidden rounded-lg">
              <img 
                src={profile.hobby_photo_url} 
                alt="Hobby" 
                className="w-full h-auto max-h-96 object-contain"
                onError={(e) => {
                  console.error("Hobby image load error:", e);
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              {profile.hobby_photo_comment && (
                <p className="mt-3 text-gray-600 italic">{profile.hobby_photo_comment}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <UserHobbiesSection profile={profile} title="Interests" />

      {/* Pet Photo Section - Changed to Pet Photo or Food Photo */}
      {profile.pet_photo_url && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-4">My Pet Photo or Food Photo</h3>
            <div className="overflow-hidden rounded-lg">
              <img 
                src={profile.pet_photo_url} 
                alt="Pet or Food Photo" 
                className="w-full h-auto max-h-96 object-contain"
                onError={(e) => {
                  console.error("Pet image load error:", e);
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              {profile.pet_photo_comment && (
                <p className="mt-3 text-gray-600 italic">{profile.pet_photo_comment}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <UserMoreAboutSection profile={profile} />
      
      {/* Only show stats if this is the current user's profile */}
      {isCurrentUserProfile && <UserStatsSection stats={stats} loading={loading} />}
    </div>
  );
}
