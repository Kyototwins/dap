
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";
import { fetchUserProfile } from "@/services/profileService";

export function useProfileFetching() {
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchProfile = async (
    setFormData: (data: ProfileFormData) => void,
    setAdditionalData: (data: AdditionalDataType) => void,
    setImages: (data: ImageUploadState) => void
  ) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        navigate("/login");
        return;
      }

      const profile = await fetchUserProfile(user.id);

      if (profile) {
        // Parse language levels JSON if it's stored as a string
        let languageLevels = {};
        if (profile.language_levels) {
          try {
            languageLevels = typeof profile.language_levels === 'string' 
              ? JSON.parse(profile.language_levels) 
              : profile.language_levels;
          } catch (e) {
            console.error("Error parsing language levels:", e);
          }
        }

        // Set form data with existing profile information
        setFormData({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          age: profile.age ? profile.age.toString() : "",
          gender: profile.gender || "",
          origin: profile.origin || "",
          sexuality: profile.sexuality || "",
          aboutMe: profile.about_me || "",
          university: profile.university || "",
          department: profile.department || "",
          year: profile.year || "",
          hobbies: profile.hobbies || [],
          languages: profile.languages || [],
          languageLevels: languageLevels,
          learning_languages: profile.learning_languages || [],
          photoComment: profile.photo_comment || ""
        });

        // Set additional data - map database fields to our frontend model
        // Using the field names that actually exist in the database
        setAdditionalData({
          idealDate: profile.ideal_date || "",
          lifeGoal: profile.life_goal || "",
          superpower: profile.superpower || "",
          worstNightmare: profile.worst_nightmare || "", // Changed from worstNightmare to worst_nightmare
          friendActivity: profile.friend_activity || ""  // Changed from friendActivity to friend_activity
        });

        // Set image previews
        setImages({
          avatar: { 
            file: null, 
            preview: profile.avatar_url || "", 
            uploading: false 
          },
          image1: { 
            file: null, 
            preview: profile.image_url_1 || "", 
            uploading: false 
          }
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        title: "エラーが発生しました",
        description: error.message || "プロフィール情報の取得に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  return {
    initialLoading,
    setInitialLoading,
    fetchUserProfile: fetchProfile
  };
}
