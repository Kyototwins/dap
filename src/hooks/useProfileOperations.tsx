
import { useProfileFetching } from "./profile/useProfileFetching";
import { useProfileSubmission } from "./profile/useProfileSubmission";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";
import { useState, useEffect } from "react";

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

  // Auto-set initialLoading to false once profile data is loaded
  useEffect(() => {
    if (!isLoading && profile) {
      setInitialLoading(false);
    }
  }, [isLoading, profile]);

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
