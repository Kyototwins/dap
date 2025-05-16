
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditProfileButton } from "@/components/profile/EditProfileButton";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAboutTab } from "@/components/profile/ProfileAboutTab";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";
import { Bell } from "lucide-react";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { useProfileFetching } from "@/hooks/profile/useProfileFetching";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { Profile as MessageProfile } from "@/types/messages";

export function ProfileContainer() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { profile, isLoading, error, refreshProfile } = useProfileFetching();
  const { connectionError, offline } = useConnectionStatus();
  const [activeTab, setActiveTab] = useState("about");
  
  useEffect(() => {
    // Refresh profile after closing the form
    if (!isEditMode) {
      refreshProfile();
    }
  }, [isEditMode, refreshProfile]);

  if (isLoading) {
    return <ProfileLoading />;
  }

  if (error || !profile) {
    return (
      <ProfileNotFound
        message="Failed to load profile"
        offline={offline}
        connectionError={connectionError}
      />
    );
  }

  // Ensure the profile has required fields for MessageProfile compatibility
  const messageProfile = {
    ...profile,
    id: profile.id,
    created_at: profile.created_at,
    first_name: profile.first_name || null,
    last_name: profile.last_name || null,
    age: profile.age || null,
    gender: profile.gender || null,
    origin: profile.origin || null,
    about_me: profile.about_me || null,
    university: profile.university || null,
    department: profile.department || null,
    year: profile.year || null,
    hobbies: profile.hobbies || null,
    languages: profile.languages || null,
    language_levels: profile.language_levels || null,
    learning_languages: profile.learning_languages || null,
  };

  if (isEditMode) {
    return <ProfileForm profile={profile} onCancel={() => setIsEditMode(false)} />;
  }

  return (
    <div className="pb-32">
      <ProfileHeader profile={messageProfile as MessageProfile} />
      <div className="container px-4 mt-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-1.5 items-center">
              <Bell size={16} />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="py-4">
            <ProfileAboutTab profile={messageProfile as MessageProfile} />
          </TabsContent>

          <TabsContent value="notifications" className="py-4">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>

      <EditProfileButton onClick={() => setIsEditMode(true)} />
    </div>
  );
}
