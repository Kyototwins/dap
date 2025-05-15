
import { useState, useEffect } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
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
    pet: { file: null, preview: "", uploading: false }
  });

  const { 
    loading, 
    initialLoading, 
    handleSubmit, 
    fetchUserProfile 
  } = useProfileOperations();

  // Fetch user profile data when component mounts
  useEffect(() => {
    fetchUserProfile(setFormData, setAdditionalData, setImages);
  }, []);

  if (initialLoading) {
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
