
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile as ProfileType } from "@/types/messages";
import { useAuth } from "@/hooks/useAuth";
import { UserProfileCover } from "@/components/profile/UserProfileCover";
import { UserProfileHeader } from "@/components/profile/UserProfileHeader";
import { UserProfileActions } from "@/components/profile/UserProfileActions";
import { UserProfileProgress } from "@/components/profile/UserProfileProgress";
import { UserProfileAboutTab } from "@/components/profile/UserProfileAboutTab";
import { useUserMatchStatus } from "@/components/profile/hooks/useUserMatchStatus";

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
        title: "Error",
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
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <UserProfileCover imageUrl={profile.image_url_1} />
      <UserProfileHeader profile={profile} />
      <div className="px-4">
        <UserProfileActions
          isCurrentUser={isCurrentUser}
          profileId={id}
          onEditProfileClick={handleEditProfile}
        />
        {isCurrentUser && (
          <UserProfileProgress progress={90} />
        )}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">About</h2>
          <UserProfileAboutTab profile={profile} />
        </div>
      </div>
    </div>
  );
}
