
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

interface UserProfileAboutTabProps {
  profile: Profile;
}

export function UserProfileAboutTab({ profile }: UserProfileAboutTabProps) {
  const [stats, setStats] = useState<UserStats>({
    connectionsCount: 0,
    eventsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (profile.id) {
        const userStats = await fetchUserStats(profile.id);
        setStats(userStats);
      }
      setLoading(false);
    };
    
    loadStats();
  }, [profile.id]);

  return (
    <div className="space-y-6">
      <UserAboutSection profile={profile} />
      <UserPhotoSection profile={profile} />
      <UserBasicInfoSection profile={profile} />
      <UserLanguagesSection profile={profile} />
      <UserLearningLanguagesSection profile={profile} />
      <UserHobbiesSection profile={profile} />
      <UserMoreAboutSection profile={profile} />
      <UserStatsSection stats={stats} loading={loading} />
    </div>
  );
}
