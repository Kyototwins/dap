
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/profile/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import { format } from "date-fns";
import { FormSectionTitle } from "./form/FormSectionTitle";
import { EventMapLinkInput } from "./form/EventMapLinkInput";
import { EventParticipantsInput } from "./form/EventParticipantsInput";
import { EventCategorySelect } from "./form/EventCategorySelect";

interface EditEventFormProps {
  event: Event;
}

export function EditEventForm({ event }: EditEventFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    location: event.location,
    date: format(new Date(event.date), "yyyy-MM-dd'T'HH:mm"),
    category: event.category,
    max_participants: event.max_participants === 0 ? "0" : event.max_participants.toString(),
    map_link: event.map_link || "",
  });

  const [image, setImage] = useState<{
    file: File | null;
    preview: string;
    uploading: boolean;
  }>({
    file: null,
    preview: event.image_url || "",
    uploading: false,
  });

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
      let imageUrl = event.image_url;
      if (image.file) {
        imageUrl = await handleImageChange({ target: { files: [image.file] } } as any) || event.image_url;
      }

      const maxParticipants = formData.max_participants === "" || formData.max_participants === "0" 
        ? 0 
        : parseInt(formData.max_participants);

      const updateData: any = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: formData.date,
        category: formData.category,
        max_participants: maxParticipants,
        image_url: imageUrl,
      };

      if (formData.map_link) {
        updateData.map_link = formData.map_link;
      }

      const { error } = await supabase
        .from("events")
        .update(updateData)
        .eq("id", event.id);

      if (error) throw error;

      toast({
        title: "イベントが更新されました",
        description: "イベント情報が正常に更新されました。",
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

  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd'T'HH:mm");

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">イベントを編集</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <FormSectionTitle htmlFor="title">タイトル</FormSectionTitle>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border-gray-300 rounded-md focus-visible:ring-gray-500"
            required
          />
        </div>

        <div className="space-y-2">
          <FormSectionTitle htmlFor="description">説明</FormSectionTitle>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border-gray-300 rounded-md focus-visible:ring-gray-500 min-h-[120px]"
            required
          />
        </div>

        <div className="space-y-2">
          <FormSectionTitle>イベント画像</FormSectionTitle>
          <ImageUpload
            label="画像をアップロード"
            image={image}
            onChange={handleImageChange}
            loading={loading}
          />
        </div>

        <div className="space-y-2">
          <FormSectionTitle htmlFor="location">場所</FormSectionTitle>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="border-gray-300 rounded-md focus-visible:ring-gray-500"
            required
          />
        </div>
        
        <EventMapLinkInput 
          value={formData.map_link} 
          onChange={(value) => setFormData({ ...formData, map_link: value })}
        />

        <div className="space-y-2">
          <FormSectionTitle htmlFor="startDate">日時</FormSectionTitle>
          <Input
            id="startDate"
            type="datetime-local"
            min={formattedToday}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="border-gray-300 rounded-md focus-visible:ring-gray-500"
            required
          />
        </div>

        <EventCategorySelect
          value={formData.category}
          onChange={(value) => setFormData({ ...formData, category: value })}
        />

        <EventParticipantsInput
          value={formData.max_participants}
          onChange={(value) => setFormData({ ...formData, max_participants: value })}
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/events")}
            className="border-gray-300 hover:bg-gray-50 flex-1 rounded-md"
          >
            キャンセル
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-black text-white hover:bg-gray-800 flex-1 rounded-md"
          >
            {loading ? "更新中..." : "イベントを更新"}
          </Button>
        </div>
      </div>
    </form>
  );
}
