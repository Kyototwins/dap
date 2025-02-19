
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/profile/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function CreateEvent() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    category: "",
    max_participants: "",
  });
  const [image, setImage] = useState<{
    file: File | null;
    preview: string;
    uploading: boolean;
  }>({
    file: null,
    preview: "",
    uploading: false,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = [
    "スポーツ",
    "勉強会",
    "食事会",
    "カラオケ",
    "観光",
    "その他",
  ];

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImage({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
    });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      const fileExt = file.name.split('.').pop();
      const filePath = `event-images/${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('events')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('events')
        .getPublicUrl(filePath);

      setImage(prev => ({ ...prev, uploading: false }));
      return publicUrl;
    } catch (error: any) {
      toast({
        title: "画像のアップロードに失敗しました",
        description: error.message,
        variant: "destructive",
      });
      setImage(prev => ({ ...prev, uploading: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      let imageUrl = "";
      if (image.file) {
        imageUrl = await handleImageChange({ target: { files: [image.file] } } as any) || "";
      }

      const { error } = await supabase
        .from("events")
        .insert([
          {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            date: formData.date,
            category: formData.category,
            max_participants: parseInt(formData.max_participants),
            image_url: imageUrl,
            creator_id: user.id,
            current_participants: 1,
            status: "active",
          },
        ]);

      if (error) throw error;

      toast({
        title: "イベントを作成しました",
        description: "イベントの作成が完了しました。",
      });

      navigate("/events");
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <div className="mb-8 text-center">
        <img src="/lovable-uploads/65f3a573-3b4d-4ec7-90e5-78fab77b800d.png" alt="DAP Logo" className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">イベントを作成</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-black/5 p-6 rounded-lg">
        <div className="space-y-2">
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="border-amber-600/20 focus-visible:ring-amber-600"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">説明</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="border-amber-600/20 focus-visible:ring-amber-600"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>イベント画像</Label>
          <ImageUpload
            label="画像をアップロード"
            image={image}
            onChange={handleImageChange}
            loading={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">場所</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="border-amber-600/20 focus-visible:ring-amber-600"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">日時</Label>
          <Input
            id="date"
            type="datetime-local"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            className="border-amber-600/20 focus-visible:ring-amber-600"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">カテゴリー</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
            required
          >
            <SelectTrigger className="border-amber-600/20 focus-visible:ring-amber-600">
              <SelectValue placeholder="カテゴリーを選択" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_participants">最大参加人数</Label>
          <Input
            id="max_participants"
            type="number"
            min="1"
            value={formData.max_participants}
            onChange={(e) =>
              setFormData({ ...formData, max_participants: e.target.value })
            }
            className="border-amber-600/20 focus-visible:ring-amber-600"
            required
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/events")}
            className="border-amber-600/20 hover:bg-amber-600/5"
          >
            キャンセル
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {loading ? "作成中..." : "作成する"}
          </Button>
        </div>
      </form>
    </div>
  );
}
