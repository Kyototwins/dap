
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ImageUpload {
  file: File | null;
  preview: string;
  uploading: boolean;
}

export default function ProfileSetup() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    origin: "",
    sexuality: "",
    aboutMe: "",
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

      // 画像のアップロード
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

      // プロフィールを更新
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
          avatar_url: avatarUrl,
          image_url_1: imageUrl1,
          image_url_2: imageUrl2,
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

  return (
    <AuthLayout
      title="プロフィール設定"
      subtitle="あなたのことを教えてください"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 既存のフォーム要素 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">姓</Label>
            <Input
              id="firstName"
              placeholder="山田"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">名</Label>
            <Input
              id="lastName"
              placeholder="太郎"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* 画像アップロード部分 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>プロフィール写真（アイコンとして使用されます）</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                {images.avatar.preview ? (
                  <img
                    src={images.avatar.preview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'avatar')}
                  disabled={loading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {images.avatar.uploading && <Loader2 className="w-6 h-6 animate-spin" />}
            </div>
          </div>

          <div className="space-y-2">
            <Label>追加の写真 1</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                {images.image1.preview ? (
                  <img
                    src={images.image1.preview}
                    alt="Image 1 preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'image1')}
                  disabled={loading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {images.image1.uploading && <Loader2 className="w-6 h-6 animate-spin" />}
            </div>
          </div>

          <div className="space-y-2">
            <Label>追加の写真 2</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                {images.image2.preview ? (
                  <img
                    src={images.image2.preview}
                    alt="Image 2 preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'image2')}
                  disabled={loading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {images.image2.uploading && <Loader2 className="w-6 h-6 animate-spin" />}
            </div>
          </div>
        </div>

        {/* 残りのフォーム要素 */}
        <div className="space-y-2">
          <Label htmlFor="age">年齢</Label>
          <Input
            id="age"
            type="number"
            min="18"
            max="100"
            value={formData.age}
            onChange={(e) => handleChange("age", e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label>性別</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleChange("gender", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="性別を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">男性</SelectItem>
              <SelectItem value="female">女性</SelectItem>
              <SelectItem value="other">その他</SelectItem>
              <SelectItem value="prefer_not_to_say">回答しない</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>出身地</Label>
          <Select
            value={formData.origin}
            onValueChange={(value) => handleChange("origin", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="出身地を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="japan">日本</SelectItem>
              <SelectItem value="china">中国</SelectItem>
              <SelectItem value="korea">韓国</SelectItem>
              <SelectItem value="usa">アメリカ</SelectItem>
              <SelectItem value="other">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>性的指向</Label>
          <Select
            value={formData.sexuality}
            onValueChange={(value) => handleChange("sexuality", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="性的指向を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="heterosexual">異性愛</SelectItem>
              <SelectItem value="homosexual">同性愛</SelectItem>
              <SelectItem value="bisexual">両性愛</SelectItem>
              <SelectItem value="other">その他</SelectItem>
              <SelectItem value="prefer_not_to_say">回答しない</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aboutMe">自己紹介</Label>
          <Textarea
            id="aboutMe"
            placeholder="あなたの興味や趣味について教えてください"
            value={formData.aboutMe}
            onChange={(e) => handleChange("aboutMe", e.target.value)}
            className="min-h-[100px]"
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "保存中..." : "プロフィールを保存"}
        </Button>
      </form>
    </AuthLayout>
  );
}
