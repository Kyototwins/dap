
import { useProfileFetching } from "./profile/useProfileFetching";
import { useProfileSubmission } from "./profile/useProfileSubmission";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";

export function useProfileOperations() {
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
    setLoading,
    profile,
    isLoading,
    error,
    refreshProfile,
    handleSubmit,
    fetchUserProfile
  };
}
