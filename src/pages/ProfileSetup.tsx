
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/profile/ImageUpload";
import { AdditionalQuestions } from "@/components/profile/AdditionalQuestions";
import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
import { LanguageSkillsInput } from "@/components/profile/LanguageSkillsInput";
import { HobbiesInput } from "@/components/profile/HobbiesInput";
import { Profile } from "@/types/messages";

interface ImageUpload {
  file: File | null;
  preview: string;
  uploading: boolean;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  origin: string;
  sexuality: string;
  aboutMe: string;
  university: string;
  department: string;
  year: string;
  hobbies: string[];
  languages: string[];
  languageLevels: Record<string, number>;
  learning_languages: string[];
}

export default function ProfileSetup() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    origin: "",
    sexuality: "",
    aboutMe: "",
    university: "",
    department: "",
    year: "",
    hobbies: [],
    languages: [],
    languageLevels: {},
    learning_languages: []
  });
  const [additionalData, setAdditionalData] = useState({
    idealDate: "",
    lifeGoal: "",
    superpower: "",
  });
  const [images, setImages] = useState<{
    avatar: ImageUpload;
    image1: ImageUpload;
    image2: ImageUpload;
  }>({
    avatar: { file: null, preview: "", uploading: false },
    image1: { file: null, preview: "", uploading: false },
    image2: { file: null, preview: "", uploading: false },
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
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

    fetchUserProfile();
  }, [navigate, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'image1' | 'image2') => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImages(prev => ({
        ...prev,
        [type]: { file, preview, uploading: false }
      }));
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("ユーザーが見つかりません");

      let avatarUrl = null;
      let imageUrl1 = null;
      let imageUrl2 = null;

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

  const handleChange = (name: string, value: string | string[] | Record<string, number>) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdditionalChange = (name: string, value: string) => {
    setAdditionalData(prev => ({ ...prev, [name]: value }));
  };

  if (initialLoading) {
    return (
      <AuthLayout
        title="プロフィール設定"
        subtitle="読み込み中..."
      >
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="プロフィール設定"
      subtitle="あなたのことを教えてください"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <ImageUpload
            label="プロフィール写真（アイコンとして使用されます）"
            image={images.avatar}
            onChange={(e) => handleImageChange(e, 'avatar')}
            loading={loading}
          />
          <ImageUpload
            label="追加の写真 1"
            image={images.image1}
            onChange={(e) => handleImageChange(e, 'image1')}
            loading={loading}
          />
          <ImageUpload
            label="追加の写真 2"
            image={images.image2}
            onChange={(e) => handleImageChange(e, 'image2')}
            loading={loading}
          />
        </div>

        <div className="space-y-4">
          <BasicInfoForm 
            formData={formData}
            onChange={handleChange}
            loading={loading}
          />
          
          <LanguageSkillsInput
            languages={formData.languages}
            languageLevels={formData.languageLevels}
            learningLanguages={formData.learning_languages}
            onChange={handleChange}
            loading={loading}
          />
          
          <HobbiesInput
            hobbies={formData.hobbies}
            onChange={handleChange}
            loading={loading}
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">追加の質問</h3>
          <AdditionalQuestions
            data={additionalData}
            onChange={handleAdditionalChange}
            loading={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "保存中..." : "プロフィールを保存"}
        </Button>
      </form>
    </AuthLayout>
  );
}
