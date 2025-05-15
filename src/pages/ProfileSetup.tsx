
import { useState, useEffect } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useProfileOperations } from "@/hooks/useProfileOperations";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";

export default function ProfileSetup() {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    origin: "",
    sexuality: "",
    aboutMe: "",
    university: "",
    department: "",
    year: "",
    hobbies: [],
    languages: [],
    languageLevels: {},
    learning_languages: [],
    photoComment: "",
    hobbyPhotoComment: "",
    petPhotoComment: "",
  });
  
  const [additionalData, setAdditionalData] = useState<AdditionalDataType>({
    idealDate: "",
    lifeGoal: "",
    superpower: "",
    worstNightmare: "",
    friendActivity: "",
    bestQuality: "",
  });
  
  const [images, setImages] = useState<ImageUploadState>({
    avatar: { file: null, preview: "", uploading: false },
    image1: { file: null, preview: "", uploading: false },
    image2: { file: null, preview: "", uploading: false },
    hobby: { file: null, preview: "", uploading: false },
    pet: { file: null, preview: "", uploading: false }
  });

  const { 
    loading, 
    isLoading, 
    handleSubmit, 
    profile,
    refreshProfile
  } = useProfileOperations();

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First, refresh the profile to ensure we have the latest data
        await refreshProfile();
        
        // If profile is available, populate the form fields
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
            petPhotoComment: profile.pet_photo_comment || ""
          });

          setAdditionalData({
            idealDate: profile.ideal_date || "",
            lifeGoal: profile.life_goal || "",
            superpower: profile.superpower || "",
            worstNightmare: profile.worst_nightmare || "",
            friendActivity: profile.friend_activity || "",
            bestQuality: profile.best_quality || ""
          });

          setImages({
            avatar: { file: null, preview: profile.avatar_url || "", uploading: false },
            image1: { file: null, preview: profile.image_url_1 || "", uploading: false },
            image2: { file: null, preview: profile.image_url_2 || "", uploading: false },
            hobby: { file: null, preview: profile.hobby_photo_url || "", uploading: false },
            pet: { file: null, preview: profile.pet_photo_url || "", uploading: false }
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    fetchUserData();
  }, [profile, refreshProfile]);

  if (isLoading) {
    return <ProfileLoading />;
  }

  // Create a mock profile object that contains all the needed properties
  const profileData = {
    ...formData,
    ...additionalData,
    avatar_url: images.avatar.preview,
    image_url_1: images.image1.preview,
    image_url_2: images.image2.preview,
    hobby_photo_url: images.hobby.preview,
    pet_photo_url: images.pet.preview,
    first_name: formData.firstName,
    last_name: formData.lastName,
    about_me: formData.aboutMe,
    language_levels: formData.languageLevels,
    hobbies: formData.hobbies,
    languages: formData.languages,
    learning_languages: formData.learning_languages,
    photo_comment: formData.photoComment,
    hobby_photo_comment: formData.hobbyPhotoComment,
    pet_photo_comment: formData.petPhotoComment,
    ideal_date: additionalData.idealDate,
    life_goal: additionalData.lifeGoal,
    superpower: additionalData.superpower,
    worst_nightmare: additionalData.worstNightmare,
    friend_activity: additionalData.friendActivity,
    best_quality: additionalData.bestQuality
  };

  return (
    <AuthLayout
      title="Profile Setup"
      subtitle="Tell us about yourself"
    >
      <ProfileForm
        profile={profileData}
        onCancel={() => window.history.back()}
      />
    </AuthLayout>
  );
}
