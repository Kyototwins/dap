
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";
import { useProfileImageUpload } from "./useProfileImageUpload";
import { updateUserProfile } from "@/services/profileService";

export function useProfileSubmission() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
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
      if (userError) {
        console.error("User error:", userError);
        throw userError;
      }
      if (!user) {
        console.error("User not found");
        throw new Error("User not found");
      }

      console.log("Processing profile submission for user:", user.id);
      console.log("Form data:", formData);

      let avatarUrl = images.avatar.preview;
      let imageUrl1 = images.image1.preview;
      let imageUrl2 = images.image2.preview;
      let hobbyPhotoUrl = images.hobby.preview;
      let petPhotoUrl = images.pet.preview;

      // Upload any new images
      if (images.avatar.file) {
        console.log("Uploading new avatar image");
        avatarUrl = await uploadImage(images.avatar.file, 'avatars');
      }
      if (images.image1.file) {
        console.log("Uploading new image1");
        imageUrl1 = await uploadImage(images.image1.file, 'images');
      }
      if (images.image2.file) {
        console.log("Uploading new image2");
        imageUrl2 = await uploadImage(images.image2.file, 'images');
      }
      if (images.hobby.file) {
        console.log("Uploading new hobby image");
        hobbyPhotoUrl = await uploadImage(images.hobby.file, 'hobbies');
      }
      if (images.pet.file) {
        console.log("Uploading new pet image");
        petPhotoUrl = await uploadImage(images.pet.file, 'pets');
      }

      console.log("All images processed, updating profile");

      await updateUserProfile(
        user.id,
        formData,
        additionalData,
        avatarUrl,
        imageUrl1,
        imageUrl2,
        hobbyPhotoUrl,
        petPhotoUrl
      );

      console.log("Profile updated successfully");

      toast({
        title: "プロフィールを保存しました",
        description: "マッチングページに移動します",
      });

      navigate("/matches");

    } catch (error: any) {
      console.error("Profile submission error:", error);
      toast({
        title: "エラー",
        description: error.message || "プロフィールの保存に失敗しました。",
        variant: "destructive",
      });
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
