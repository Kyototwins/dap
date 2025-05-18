import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile as ProfileType } from "@/types/messages";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
// DeleteAccountButtonのimportを削除

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
      
      // Create a complete profile object with all required fields
      // including fcm_token which might not be in the database yet
      const completeProfile: ProfileType = {
        id: data.id,
        created_at: data.created_at,
        first_name: data.first_name,
        last_name: data.last_name,
        age: data.age,
        gender: data.gender,
        origin: data.origin,
        about_me: data.about_me,
        avatar_url: data.avatar_url,
        sexuality: data.sexuality,
        university: data.university,
        department: data.department,
        year: data.year,
        image_url_1: data.image_url_1,
        image_url_2: data.image_url_2,
        ideal_date: data.ideal_date,
        life_goal: data.life_goal,
        superpower: data.superpower,
        worst_nightmare: data.worst_nightmare,
        friend_activity: data.friend_activity,
        best_quality: data.best_quality,
        photo_comment: data.photo_comment,
        hobby_photo_url: data.hobby_photo_url,
        hobby_photo_comment: data.hobby_photo_comment,
        hobbies: data.hobbies,
        languages: data.languages,
        learning_languages: data.learning_languages,
        language_levels: data.language_levels,
        pet_photo_url: data.pet_photo_url,
        pet_photo_comment: data.pet_photo_comment,
        fcm_token: (data as any).fcm_token || null // Add FCM token with fallback
      };
      
      setProfile(completeProfile);

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
    </div>
  );
}
