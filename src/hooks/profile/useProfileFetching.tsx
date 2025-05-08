
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";

// Define a type for the profile data from the database
interface ProfileData {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  gender: string | null;
  origin: string | null;
  sexuality: string | null;
  about_me: string | null;
  university: string | null;
  department: string | null;
  year: string | null;
  hobbies: string[] | null;
  languages: string[] | null;
  language_levels: Record<string, number> | string | null;
  learning_languages: string[] | null;
  avatar_url: string | null;
  image_url_1: string | null;
  image_url_2: string | null;
  ideal_date: string | null;
  life_goal: string | null;
  superpower: string | null;
  photo_comment: string | null;
  worst_nightmare: string | null;
  friend_activity: string | null;
  best_quality: string | null;
  hobby_photo_url: string | null;
  hobby_photo_comment: string | null;
  // Changed back to pet photo fields
  pet_photo_url: string | null;
  pet_photo_comment: string | null;
}

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

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      
      // Cast data to our ProfileData type to ensure type safety
      const profile = data as unknown as ProfileData;

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
          photoComment: profile.photo_comment || "",
          hobbyPhotoComment: profile.hobby_photo_comment || "",
          petPhotoComment: profile.pet_photo_comment || ""  // Changed back from foodPhotoComment
        });

        // Set additional data - map database fields to our frontend model
        setAdditionalData({
          idealDate: profile.ideal_date || "",
          lifeGoal: profile.life_goal || "",
          superpower: profile.superpower || "",
          worstNightmare: profile.worst_nightmare || "", 
          friendActivity: profile.friend_activity || "",
          bestQuality: profile.best_quality || ""
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
          },
          image2: { 
            file: null, 
            preview: profile.image_url_2 || "", 
            uploading: false 
          },
          hobby: {
            file: null,
            preview: profile.hobby_photo_url || "",
            uploading: false
          },
          pet: {  // Changed back from food
            file: null,
            preview: profile.pet_photo_url || "",  // Changed back from favorite_food_photo_url
            uploading: false
          }
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch profile information.",
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
