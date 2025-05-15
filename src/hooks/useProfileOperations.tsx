
import { useProfileFetching } from "./profile/useProfileFetching";
import { useProfileSubmission } from "./profile/useProfileSubmission";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";

export function useProfileOperations() {
  const { 
    initialLoading, 
    isLoading, 
    profile, 
    error,
    setInitialLoading, 
    fetchUserProfile, 
    refreshProfile 
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
