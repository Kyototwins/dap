
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileOperations } from "@/hooks/useProfileOperations";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileLoading } from "@/components/profile/ProfileLoading";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { isLoading, profile, fetchUserProfile } = useProfileOperations();

  // Fetch user profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      if (fetchUserProfile) {
        await fetchUserProfile();
      }
    };
    
    loadProfile();
  }, [fetchUserProfile]);

  if (isLoading) {
    return <ProfileLoading />;
  }

  const handleCancel = () => {
    // Navigate back to profile if profile exists, otherwise to matches
    navigate(profile ? "/profile" : "/matches", { replace: true });
  };

  return (
    <ProfileForm
      profile={profile}
      onCancel={handleCancel}
    />
  );
}
