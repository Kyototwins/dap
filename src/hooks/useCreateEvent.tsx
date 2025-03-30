
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useCreateEvent() {
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

  return {
    formData,
    setFormData,
    image,
    setImage,
    loading,
    handleImageChange,
    handleSubmit
  };
}
