
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
  });
  
  const [additionalData, setAdditionalData] = useState<AdditionalDataType>({
    idealDate: "",
    lifeGoal: "",
    superpower: "",
    worstNightmare: "",
    friendActivity: "",
  });
  
  const [images, setImages] = useState<ImageUploadState>({
    avatar: { file: null, preview: "", uploading: false },
    image1: { file: null, preview: "", uploading: false },
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'image1') => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImages(prev => ({
        ...prev,
        [type]: { file, preview, uploading: false }
      }));
    }
  };

  const handleChange = (name: string, value: string | string[] | Record<string, number>) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoCommentChange = (comment: string) => {
    setFormData(prev => ({ ...prev, photoComment: comment }));
  };

  const handleAdditionalChange = (name: string, value: string) => {
    setAdditionalData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e, formData, additionalData, images);
  };

  if (initialLoading) {
    return <ProfileLoading />;
  }

  return (
    <AuthLayout
      title="Profile Setup"
      subtitle="Tell us about yourself"
    >
      <ProfileForm
        formData={formData}
        additionalData={additionalData}
        images={images}
        onChange={handleChange}
        onAdditionalChange={handleAdditionalChange}
        onImageChange={handleImageChange}
        onPhotoCommentChange={handlePhotoCommentChange}
        onSubmit={handleFormSubmit}
        loading={loading}
      />
    </AuthLayout>
  );
}
