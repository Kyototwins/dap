
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";
import { useProfileImageUpload } from "./useProfileImageUpload";
import { updateUserProfile } from "@/services/profileService";

export function useProfileSubmission() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { uploadImage } = useProfileImageUpload();

  const handleSubmit = async (
    e: React.FormEvent, 
    formData: ProfileFormData, 
    additionalData: AdditionalDataType,
    images: ImageUploadState
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("User not found");

      // Initialize URLs with current values
      let avatarUrl = images.avatar.preview;
      let imageUrl1 = images.image1.preview;
      let imageUrl2 = images.image2.preview;
      let hobbyPhotoUrl = images.hobby.preview;
      let foodPhotoUrl = images.food.preview;  // Changed from petPhotoUrl

      // Check if these are blob URLs which need to be uploaded
      const isBlobUrl = (url: string) => url.startsWith('blob:');

      // Upload any new images
      if (images.avatar.file) {
        const url = await uploadImage(images.avatar.file, 'avatars');
        if (url) avatarUrl = url;
      } else if (avatarUrl && isBlobUrl(avatarUrl)) {
        avatarUrl = "";
      }

      if (images.image1.file) {
        const url = await uploadImage(images.image1.file, 'images');
        if (url) imageUrl1 = url;
      } else if (imageUrl1 && isBlobUrl(imageUrl1)) {
        imageUrl1 = ""; 
      }

      if (images.image2.file) {
        const url = await uploadImage(images.image2.file, 'images');
        if (url) imageUrl2 = url;
      } else if (imageUrl2 && isBlobUrl(imageUrl2)) {
        imageUrl2 = "";
      }

      if (images.hobby.file) {
        const url = await uploadImage(images.hobby.file, 'hobbies');
        if (url) hobbyPhotoUrl = url;
      } else if (hobbyPhotoUrl && isBlobUrl(hobbyPhotoUrl)) {
        hobbyPhotoUrl = "";
      }

      if (images.food.file) {
        const url = await uploadImage(images.food.file, 'foods');  // Changed from 'pets' to 'foods'
        if (url) foodPhotoUrl = url;
      } else if (foodPhotoUrl && isBlobUrl(foodPhotoUrl)) {
        foodPhotoUrl = "";
      }

      await updateUserProfile(
        user.id,
        formData,
        additionalData,
        avatarUrl,
        imageUrl1,
        imageUrl2,
        hobbyPhotoUrl,
        foodPhotoUrl  // Changed from petPhotoUrl
      );

      navigate("/matches");

    } catch (error: any) {
      console.error("Profile submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    handleSubmit
  };
}
