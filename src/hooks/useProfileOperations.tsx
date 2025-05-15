
import { useProfileFetching } from "./profile/useProfileFetching";
import { useProfileSubmission } from "./profile/useProfileSubmission";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";
import { useState } from "react";

export function useProfileOperations() {
  const [initialLoading, setInitialLoading] = useState(true);
  
  const { 
    profile, 
    isLoading, 
    error, 
    refreshProfile,
    fetchUserProfile 
  } = useProfileFetching();
  
  const { loading, setLoading, handleSubmit } = useProfileSubmission();

  return {
    loading,
    isLoading,
    profile,
    error,
    setLoading,
    initialLoading,
    setInitialLoading,
    handleSubmit,
    fetchUserProfile,
    refreshProfile
  };
}
