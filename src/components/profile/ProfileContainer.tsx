
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
import { useProfileOperations } from "@/hooks/useProfileOperations";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

export function ProfileContainer() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { profile, isLoading, error, refreshProfile, initialLoading } = useProfileOperations();
  const { connectionError, offline } = useConnectionStatus();
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    // 初回レンダリング時にプロフィールを取得
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    // フォームを閉じた後にプロフィールを再取得
    if (!isEditMode) {
      refreshProfile();
    }
  }, [isEditMode, refreshProfile]);

  if (isLoading || initialLoading) {
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

  if (isEditMode) {
    return <ProfileForm profile={profile} onCancel={() => setIsEditMode(false)} />;
  }

  return (
    <div className="pb-32">
      <ProfileHeader profile={profile} />
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
            <ProfileAboutTab profile={profile} />
          </TabsContent>

          <TabsContent value="stats" className="py-4">
            <ProfileInfo profile={profile} />
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
