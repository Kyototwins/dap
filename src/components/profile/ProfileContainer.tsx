
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditProfileButton } from "@/components/profile/EditProfileButton";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
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
    // フォームを閉じた後にプロフィールを再取得
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
        message="プロフィールの読み込みに失敗しました"
        offline={offline}
        connectionError={connectionError}
      />
    );
  }

  // Convert to the MessageProfile type to ensure compatibility with components
  const messageProfile: MessageProfile = {
    ...profile,
    id: profile.id || "",
    created_at: profile.created_at || new Date().toISOString()
  };

  if (isEditMode) {
    return <ProfileForm profile={profile} onCancel={() => setIsEditMode(false)} />;
  }

  return (
    <div className="pb-32">
      <ProfileHeader profile={messageProfile} />
      <div className="container px-4 mt-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="stats">統計</TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-1.5 items-center">
              <Bell size={16} />
              <span>通知</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="py-4">
            <ProfileAboutTab profile={messageProfile} />
          </TabsContent>

          <TabsContent value="stats" className="py-4">
            <ProfileInfo profile={messageProfile} />
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
