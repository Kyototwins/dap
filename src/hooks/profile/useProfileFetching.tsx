
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";

export function useProfileFetching() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch the user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = () => {
    return fetchProfile();
  };

  const fetchUserProfile = async (
    setFormData: (data: ProfileFormData) => void,
    setAdditionalData: (data: AdditionalDataType) => void,
    setImages: (data: ImageUploadState) => void
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      // Parse language levels JSON if it's stored as a string
      let languageLevels = {};
      if (data.language_levels) {
        try {
          languageLevels = typeof data.language_levels === 'string'
            ? JSON.parse(data.language_levels)
            : data.language_levels;
        } catch (e) {
          console.error("Error parsing language levels:", e);
        }
      }

      setFormData({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        age: data.age ? data.age.toString() : "",
        gender: data.gender || "",
        origin: data.origin || "",
        sexuality: data.sexuality || "",
        aboutMe: data.about_me || "",
        university: data.university || "",
        department: data.department || "",
        year: data.year || "",
        hobbies: data.hobbies || [],
        languages: data.languages || [],
        languageLevels: languageLevels,
        learning_languages: data.learning_languages || [],
        photoComment: data.photo_comment || "",
        hobbyPhotoComment: data.hobby_photo_comment || "",
        petPhotoComment: data.pet_photo_comment || ""
      });

      setAdditionalData({
        idealDate: data.ideal_date || "",
        lifeGoal: data.life_goal || "",
        superpower: data.superpower || "",
        worstNightmare: data.worst_nightmare || "",
        friendActivity: data.friend_activity || "",
        bestQuality: data.best_quality || ""
      });

      setImages({
        avatar: { file: null, preview: data.avatar_url || "", uploading: false },
        image1: { file: null, preview: data.image_url_1 || "", uploading: false },
        image2: { file: null, preview: data.image_url_2 || "", uploading: false },
        hobby: { file: null, preview: data.hobby_photo_url || "", uploading: false },
        pet: { file: null, preview: data.pet_photo_url || "", uploading: false }
      });
      
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile for form:", err);
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { profile, isLoading, error, refreshProfile, fetchUserProfile };
}
