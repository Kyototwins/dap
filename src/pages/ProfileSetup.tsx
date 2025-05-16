
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileOperations } from "@/hooks/useProfileOperations";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileLoading } from "@/components/profile/ProfileLoading";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { isLoading, profile, fetchUserProfile } = useProfileOperations();

  // Fetch user profile data when component mounts
  useEffect(() => {
    if (fetchUserProfile) {
      fetchUserProfile();
    }
  }, [fetchUserProfile]);

  if (isLoading) {
    return <ProfileLoading />;
  }

  return (
    <ProfileForm
      profile={profile}
      onCancel={() => navigate("/")}
    />
  );
}
