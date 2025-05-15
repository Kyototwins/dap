
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileOperations } from "@/hooks/useProfileOperations";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";

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
    pet: { file: null, preview: "", uploading: false },
  });

  const navigate = useNavigate();

  const { 
    loading, 
    isLoading, 
    handleSubmit, 
    profile,
    fetchUserProfile 
  } = useProfileOperations();

  // Fetch user profile data when component mounts
  useEffect(() => {
    // Check if fetchUserProfile exists before calling it
    if (fetchUserProfile) {
      const updateProfileData = (profileData: any) => {
        if (profileData) {
          // Parse language levels JSON if it's stored as a string
          let languageLevels = {};
          if (profileData.language_levels) {
            try {
              languageLevels = typeof profileData.language_levels === 'string'
                ? JSON.parse(profileData.language_levels)
                : profileData.language_levels;
            } catch (e) {
              console.error("Error parsing language levels:", e);
            }
          }

          setFormData({
            firstName: profileData.first_name || "",
            lastName: profileData.last_name || "",
            age: profileData.age ? profileData.age.toString() : "",
            gender: profileData.gender || "",
            origin: profileData.origin || "",
            sexuality: profileData.sexuality || "",
            aboutMe: profileData.about_me || "",
            university: profileData.university || "",
            department: profileData.department || "",
            year: profileData.year || "",
            hobbies: profileData.hobbies || [],
            languages: profileData.languages || [],
            languageLevels: languageLevels,
            learning_languages: profileData.learning_languages || [],
            photoComment: profileData.photo_comment || "",
            hobbyPhotoComment: profileData.hobby_photo_comment || "",
            petPhotoComment: profileData.pet_photo_comment || ""
          });

          setAdditionalData({
            idealDate: profileData.ideal_date || "",
            lifeGoal: profileData.life_goal || "",
            superpower: profileData.superpower || "",
            worstNightmare: profileData.worst_nightmare || "",
            friendActivity: profileData.friend_activity || "",
            bestQuality: profileData.best_quality || ""
          });

          setImages({
            avatar: { file: null, preview: profileData.avatar_url || "", uploading: false },
            image1: { file: null, preview: profileData.image_url_1 || "", uploading: false },
            image2: { file: null, preview: profileData.image_url_2 || "", uploading: false },
            hobby: { file: null, preview: profileData.hobby_photo_url || "", uploading: false },
            pet: { file: null, preview: profileData.pet_photo_url || "", uploading: false }
          });
        }
      };

      fetchUserProfile().then(updateProfileData);
    }
  }, [fetchUserProfile]);

  if (isLoading) {
    return <ProfileLoading />;
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e, formData, additionalData, images);
  };

  return (
    <ProfileForm
      profile={profile}
      onCancel={() => navigate("/")}
    />
  );
}
