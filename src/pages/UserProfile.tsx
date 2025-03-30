
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile as ProfileType } from "@/types/messages";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { EducationInfo } from "@/components/profile/EducationInfo";
import { AboutMe } from "@/components/profile/AboutMe";
import { LanguagesDisplay } from "@/components/profile/LanguagesDisplay";
import { HobbiesDisplay } from "@/components/profile/HobbiesDisplay";
import { AdditionalInfo } from "@/components/profile/AdditionalInfo";

export default function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">プロフィールが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <ProfileHeader profile={profile} />
      <EducationInfo profile={profile} />
      <AboutMe profile={profile} />
      <LanguagesDisplay profile={profile} />
      <HobbiesDisplay profile={profile} />
      <AdditionalInfo profile={profile} />
    </div>
  );
}
