
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile as ProfileType } from "@/types/messages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { UserProfileCover } from "@/components/profile/UserProfileCover";
import { UserProfileHeader } from "@/components/profile/UserProfileHeader";
import { UserProfileActions } from "@/components/profile/UserProfileActions";
import { UserProfileProgress } from "@/components/profile/UserProfileProgress";
import { UserProfileAboutTab } from "@/components/profile/UserProfileAboutTab";
import { EmptyTabContent } from "@/components/profile/EmptyTabContent";

export default function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const authOperations = useAuth();

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      // Check if this is the current user's profile
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (user && id === user.id) {
        setIsCurrentUser(true);
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProfile(data as ProfileType);
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

  const handleMessage = () => {
    // Navigate to messages with this user
    navigate("/messages");
  };

  const handleEditProfile = () => {
    navigate("/profile/setup");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-doshisha-purple"></div>
      </div>
    );
  }

  if (!profile || !id) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">プロフィールが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Header image */}
      <UserProfileCover imageUrl={profile.image_url_1} />
      
      {/* Profile avatar and basic info */}
      <UserProfileHeader profile={profile} />
      
      {/* Action buttons */}
      <div className="px-4">
        <UserProfileActions 
          isCurrentUser={isCurrentUser}
          profileId={id}
          onMessageClick={handleMessage}
          onEditProfileClick={handleEditProfile}
        />
        
        {/* Profile completion progress - only show for current user */}
        {isCurrentUser && (
          <UserProfileProgress progress={90} />
        )}
        
        {/* Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full bg-transparent border-b border-gray-200 rounded-none p-0 mb-6">
            <TabsTrigger 
              value="about" 
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-doshisha-purple data-[state=active]:text-doshisha-purple rounded-none"
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="connections" 
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-doshisha-purple data-[state=active]:text-doshisha-purple rounded-none"
            >
              Connections
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-doshisha-purple data-[state=active]:text-doshisha-purple rounded-none"
            >
              Events
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-0 space-y-6">
            <UserProfileAboutTab profile={profile} />
          </TabsContent>
          
          <TabsContent value="connections">
            <EmptyTabContent message="No connections yet" />
          </TabsContent>
          
          <TabsContent value="events">
            <EmptyTabContent message="No events yet" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
