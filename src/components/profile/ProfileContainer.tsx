
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile as ProfileType } from "@/types/messages";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@supabase/supabase-js";

export function ProfileContainer() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState(0);
  const [activeTab, setActiveTab] = useState("about");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        navigate("/login");
        return;
      }
      
      setUserAuth(user);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data as ProfileType);

      // プロフィールの完成度を計算
      if (data) {
        calculateCompletion(data);
      }
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = (profile: any) => {
    const fields = [
      'first_name', 'last_name', 'age', 'gender', 'origin', 'university',
      'department', 'about_me', 'avatar_url', 'languages'
    ];

    const completedFields = fields.filter(field => {
      if (Array.isArray(profile[field])) {
        return profile[field].length > 0;
      }
      return profile[field] !== null && profile[field] !== '';
    });

    setCompletion(Math.round((completedFields.length / fields.length) * 100));
  };

  const handleEditProfile = () => {
    navigate("/profile/setup");
  };

  const handleNotificationSettingsUpdate = async (emailDigestEnabled: boolean, notificationEmail?: string) => {
    try {
      if (!profile || !userAuth) return;
      
      const updateData: { email_digest_enabled: boolean, notification_email?: string } = {
        email_digest_enabled: emailDigestEnabled
      };
      
      // Only update notification email if provided
      if (notificationEmail !== undefined) {
        updateData.notification_email = notificationEmail;
      }
      
      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", profile.id);

      if (error) throw error;

      // Update local state
      setProfile(prev => prev ? { 
        ...prev, 
        email_digest_enabled: emailDigestEnabled,
        notification_email: notificationEmail !== undefined ? notificationEmail : prev.notification_email
      } : null);

      toast({
        title: "Notification settings updated",
        description: "Your notification settings have been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Error updating notification settings",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <ProfileLoading />;
  }

  if (!profile) {
    return <ProfileNotFound />;
  }

  return (
    <div className="space-y-6">
      <ProfileInfo
        profile={profile}
        completion={completion}
        onEditProfile={handleEditProfile}
        showTabs={false} // Don't show tabs in the ProfileInfo component
      />

      <div className="px-4">
        <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-4">
            <ProfileInfo
              profile={profile}
              completion={completion}
              onEditProfile={handleEditProfile}
              showContent={true}
              showTabs={false}
            />
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-4">
            <NotificationSettings 
              emailDigestEnabled={!!profile.email_digest_enabled} 
              notificationEmail={profile.notification_email || ""}
              defaultEmail={userAuth?.email || ""}
              onUpdateSettings={handleNotificationSettingsUpdate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
