
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
    fetchUserProfile 
  } = useProfileOperations();

  // Fetch user profile data when component mounts
  useEffect(() => {
    fetchUserProfile(setFormData, setAdditionalData, setImages);
  }, [fetchUserProfile]);

  if (isLoading) {
    return <ProfileLoading />;
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e, formData, additionalData, images);
  };

  return (
    <ProfileForm
      formData={formData}
      setFormData={setFormData}
      additionalData={additionalData}
      setAdditionalData={setAdditionalData}
      images={images}
      setImages={setImages}
      loading={loading}
      onSubmit={handleFormSubmit}
      onCancel={() => navigate("/")}
    />
  );
}
