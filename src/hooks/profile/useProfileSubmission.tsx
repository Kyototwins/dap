
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

      // Initialize URLs with current values
      let avatarUrl = images.avatar.preview;
      let imageUrl1 = images.image1.preview;
      let imageUrl2 = images.image2.preview;
      let hobbyPhotoUrl = images.hobby.preview;
      let petPhotoUrl = images.pet.preview;

      // Check if these are blob URLs which need to be uploaded
      const isBlobUrl = (url: string) => url.startsWith('blob:');

      // Upload any new images
      try {
        if (images.avatar.file) {
          console.log("Uploading new avatar image");
          const url = await uploadImage(images.avatar.file, 'avatars');
          if (url) avatarUrl = url;
        } else if (avatarUrl && isBlobUrl(avatarUrl)) {
          console.log("Avatar is a blob URL but no file was provided");
          avatarUrl = ""; // Reset URL if it's a blob without file
        }

        if (images.image1.file) {
          console.log("Uploading new image1");
          const url = await uploadImage(images.image1.file, 'images');
          if (url) imageUrl1 = url;
        } else if (imageUrl1 && isBlobUrl(imageUrl1)) {
          imageUrl1 = ""; 
        }

        if (images.image2.file) {
          console.log("Uploading new image2");
          const url = await uploadImage(images.image2.file, 'images');
          if (url) imageUrl2 = url;
        } else if (imageUrl2 && isBlobUrl(imageUrl2)) {
          imageUrl2 = "";
        }

        if (images.hobby.file) {
          console.log("Uploading new hobby image", images.hobby.file);
          const url = await uploadImage(images.hobby.file, 'hobbies');
          if (url) hobbyPhotoUrl = url;
        } else if (hobbyPhotoUrl && isBlobUrl(hobbyPhotoUrl)) {
          hobbyPhotoUrl = "";
        }

        if (images.pet.file) {
          console.log("Uploading new pet image", images.pet.file);
          const url = await uploadImage(images.pet.file, 'pets');
          if (url) petPhotoUrl = url;
        } else if (petPhotoUrl && isBlobUrl(petPhotoUrl)) {
          petPhotoUrl = "";
        }
      } catch (uploadError) {
        console.error("Error during image upload:", uploadError);
        toast({
          title: "画像アップロードエラー",
          description: "画像のアップロードに失敗しました。もう一度お試しください。",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("All images processed, updating profile");
      console.log("Final URLs:", { avatarUrl, imageUrl1, imageUrl2, hobbyPhotoUrl, petPhotoUrl });

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
