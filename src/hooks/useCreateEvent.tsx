import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Define the proper event insert type from the Database type
type EventInsert = Database['public']['Tables']['events']['Insert'];

export function useCreateEvent() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    category: "",
    max_participants: "",
    map_link: "",
    participation_form: "", // Added participation_form field
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
      if (!user) throw new Error("Not authenticated");

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
        title: "Failed to upload image",
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
      if (!user) throw new Error("Not authenticated");

      let imageUrl = "";
      if (image.file) {
        imageUrl = await handleImageChange({ target: { files: [image.file] } } as any) || "";
      }

      // Handle unlimited participants (max_participants = 0)
      const maxParticipants = formData.max_participants === "" || formData.max_participants === "0" 
        ? 0 
        : parseInt(formData.max_participants);

      // Create event data
      const eventData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: formData.date,
        category: formData.category,
        max_participants: maxParticipants,
        image_url: imageUrl,
        creator_id: user.id,
        current_participants: 1,
        status: "active",
      } as EventInsert;

      // Use optional map_link only if provided
      if (formData.map_link) {
        (eventData as any).map_link = formData.map_link;
      }

      // Use optional participation_form only if provided
      if (formData.participation_form) {
        (eventData as any).participation_form = formData.participation_form;
      }

      const { error } = await supabase
        .from("events")
        .insert(eventData);

      if (error) throw error;

      toast({
        title: "Event created",
        description: "Your event has been created successfully.",
      });

      // Set event creation flag in localStorage
      localStorage.setItem('created_event', 'true');

      navigate("/events");
    } catch (error: any) {
      toast({
        title: "Error occurred",
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
