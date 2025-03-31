
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";

export function useProfileOperations() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const uploadImage = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profile_images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile_images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

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

      if (images.avatar.file) {
        avatarUrl = await uploadImage(images.avatar.file, 'avatars');
      }
      if (images.image1.file) {
        imageUrl1 = await uploadImage(images.image1.file, 'images');
      }
      if (images.image2.file) {
        imageUrl2 = await uploadImage(images.image2.file, 'images');
      }

      // Convert language levels to JSON string for storage
      const languageLevelsJson = JSON.stringify(formData.languageLevels);
      const hobbiesArray = formData.hobbies;
      const languagesArray = formData.languages;
      const learningLanguagesArray = formData.learning_languages;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          age: parseInt(formData.age),
          gender: formData.gender,
          origin: formData.origin,
          sexuality: formData.sexuality,
          about_me: formData.aboutMe,
          university: formData.university,
          department: formData.department,
          year: formData.year,
          avatar_url: avatarUrl,
          image_url_1: imageUrl1,
          image_url_2: imageUrl2,
          ideal_date: additionalData.idealDate,
          life_goal: additionalData.lifeGoal,
          superpower: additionalData.superpower,
          hobbies: hobbiesArray,
          languages: languagesArray,
          language_levels: languageLevelsJson,
          learning_languages: learningLanguagesArray
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

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

  const fetchUserProfile = async (
    setFormData: (data: ProfileFormData) => void,
    setAdditionalData: (data: AdditionalDataType) => void,
    setImages: (data: ImageUploadState) => void
  ) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (profile) {
        // Parse language levels JSON if it's stored as a string
        let languageLevels = {};
        if (profile.language_levels) {
          try {
            languageLevels = typeof profile.language_levels === 'string' 
              ? JSON.parse(profile.language_levels) 
              : profile.language_levels;
          } catch (e) {
            console.error("Error parsing language levels:", e);
          }
        }

        // Set form data with existing profile information
        setFormData({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          age: profile.age ? profile.age.toString() : "",
          gender: profile.gender || "",
          origin: profile.origin || "",
          sexuality: profile.sexuality || "",
          aboutMe: profile.about_me || "",
          university: profile.university || "",
          department: profile.department || "",
          year: profile.year || "",
          hobbies: profile.hobbies || [],
          languages: profile.languages || [],
          languageLevels: languageLevels,
          learning_languages: profile.learning_languages || []
        });

        // Set additional data
        setAdditionalData({
          idealDate: profile.ideal_date || "",
          lifeGoal: profile.life_goal || "",
          superpower: profile.superpower || "",
        });

        // Set image previews
        setImages({
          avatar: { 
            file: null, 
            preview: profile.avatar_url || "", 
            uploading: false 
          },
          image1: { 
            file: null, 
            preview: profile.image_url_1 || "", 
            uploading: false 
          },
          image2: { 
            file: null, 
            preview: profile.image_url_2 || "", 
            uploading: false 
          },
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        title: "エラーが発生しました",
        description: error.message || "プロフィール情報の取得に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    initialLoading,
    setInitialLoading,
    handleSubmit,
    fetchUserProfile
  };
}
