
import { useProfileFetching } from "./profile/useProfileFetching";
import { useProfileSubmission } from "./profile/useProfileSubmission";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";

export function useProfileOperations() {
  const { initialLoading, setInitialLoading, fetchUserProfile } = useProfileFetching();
  const { loading, setLoading, handleSubmit } = useProfileSubmission();

  return {
    loading,
    setLoading,
    initialLoading,
    setInitialLoading,
    handleSubmit,
    fetchUserProfile
  };
}
