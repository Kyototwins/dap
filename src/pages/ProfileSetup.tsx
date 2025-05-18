
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
    photoComment: "", // Keep this, but it won't be used
    hobbyPhotoComment: "",
    petPhotoComment: "",  // Changed back from foodPhotoComment
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
    pet: { file: null, preview: "", uploading: false }  // Changed back from food to pet
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'image1' | 'image2' | 'hobby' | 'pet') => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(`Selected file for ${type}:`, file.name, "File object:", file);
      
      // Create a copy to avoid possible mutation issues
      const fileCopy = new File([file], file.name, { type: file.type });
      
      const preview = URL.createObjectURL(file);
      setImages(prev => ({
        ...prev,
        [type]: { file: fileCopy, preview, uploading: false }
      }));
    }
  };

  const handleChange = (name: string, value: string | string[] | Record<string, number>) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoCommentChange = (field: string, comment: string) => {
    setFormData(prev => ({ ...prev, [field]: comment }));
  };

  const handleAdditionalChange = (name: string, value: string) => {
    setAdditionalData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log("Form submit triggered", { formData, additionalData, images });
    
    // Make sure we have valid files
    const validatedImages = { ...images };
    Object.entries(validatedImages).forEach(([key, value]) => {
      if (value.file && !(value.file instanceof File)) {
        console.warn(`Invalid file object for ${key}:`, value.file);
        validatedImages[key as keyof ImageUploadState].file = null;
      }
    });
    
    handleSubmit(e, formData, additionalData, validatedImages);
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
