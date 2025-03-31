
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
      if (userError) throw userError;
      if (!user) throw new Error("ユーザーが見つかりません");

      let avatarUrl = images.avatar.preview;
      let imageUrl1 = images.image1.preview;
      let imageUrl2 = images.image2.preview;

      // Upload any new images
      if (images.avatar.file) {
        avatarUrl = await uploadImage(images.avatar.file, 'avatars');
      }
      if (images.image1.file) {
        imageUrl1 = await uploadImage(images.image1.file, 'images');
      }
      if (images.image2.file) {
        imageUrl2 = await uploadImage(images.image2.file, 'images');
      }

      // Use the new profile service to update the user profile
      await updateUserProfile(
        user.id,
        formData,
        additionalData,
        avatarUrl,
        imageUrl1,
        imageUrl2
      );

      toast({
        title: "プロフィールを保存しました",
        description: "マッチング画面に移動します",
      });

      navigate("/matches");

    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
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
