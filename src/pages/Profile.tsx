
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile as ProfileType } from "@/types/messages";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { EducationDetails } from "@/components/profile/EducationDetails";
import { ProfileBio } from "@/components/profile/ProfileBio";
import { LanguageSkills } from "@/components/profile/LanguageSkills";
import { HobbiesInterests } from "@/components/profile/HobbiesInterests";
import { OtherInfo } from "@/components/profile/OtherInfo";
import { EditProfileButton } from "@/components/profile/EditProfileButton";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";

export default function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
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

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
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

  const handleEditProfile = () => {
    navigate("/profile/setup");
  };

  if (loading) {
    return <ProfileLoading />;
  }

  if (!profile) {
    return <ProfileNotFound />;
  }

  return (
    <div className="py-6 space-y-6">
      <ProfileAvatar profile={profile} onEditClick={handleEditProfile} />
      
      <EducationDetails profile={profile} onEditClick={handleEditProfile} />
      
      <ProfileBio profile={profile} onEditClick={handleEditProfile} />
      
      <LanguageSkills profile={profile} onEditClick={handleEditProfile} />
      
      <HobbiesInterests profile={profile} onEditClick={handleEditProfile} />
      
      <OtherInfo profile={profile} onEditClick={handleEditProfile} />

      <EditProfileButton onClick={handleEditProfile} />
    </div>
  );
}
