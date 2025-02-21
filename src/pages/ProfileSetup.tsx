import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/profile/ImageUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AdditionalQuestions } from "@/components/profile/AdditionalQuestions";

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
  hobbies: string[];
  languages: string[];
  learning_languages: string[];
}

export default function ProfileSetup() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    origin: "",
    sexuality: "",
    aboutMe: "",
    university: "",
    hobbies: [],
    languages: [],
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
          avatar_url: avatarUrl,
          image_url_1: imageUrl1,
          image_url_2: imageUrl2,
          ideal_date: additionalData.idealDate,
          life_goal: additionalData.lifeGoal,
          superpower: additionalData.superpower,
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

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdditionalChange = (name: string, value: string) => {
    setAdditionalData(prev => ({ ...prev, [name]: value }));
  };

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

        <ProfileForm
          formData={formData}
          onChange={handleChange}
          loading={loading}
        />

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
