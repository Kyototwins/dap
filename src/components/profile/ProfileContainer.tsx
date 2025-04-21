import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile as ProfileType } from "@/types/messages";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { DeleteAccountButton } from "./DeleteAccountButton";

export function ProfileContainer() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState(0);
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
      
      // Calculate profile completion
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

  if (loading) {
    return <ProfileLoading />;
  }

  if (!profile) {
    return <ProfileNotFound />;
  }

  return (
    <div>
      <ProfileInfo 
        profile={profile} 
        completion={completion} 
        onEditProfile={handleEditProfile} 
      />
      <DeleteAccountButton />
    </div>
  );
}
