
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types/events";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/profile/ImageUpload";
import { useProfileImageUpload } from "@/hooks/profile/useProfileImageUpload";

interface EventImageSectionProps {
  event: Event;
  isCreator: boolean;
  refreshEvents?: () => void;
}

export function EventImageSection({ event, isCreator, refreshEvents }: EventImageSectionProps) {
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageUpload, setImageUpload] = useState({
    file: null as File | null,
    preview: event.image_url || "",
    uploading: false
  });
  const { toast } = useToast();
  const { uploadImage } = useProfileImageUpload();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUpload({
        file,
        preview: URL.createObjectURL(file),
        uploading: false
      });
    }
  };

  const saveImage = async () => {
    if (!event || !imageUpload.file) return;
    
    try {
      setImageUpload(prev => ({ ...prev, uploading: true }));
      
      const imageUrl = await uploadImage(imageUpload.file, 'events');
      
      const { error } = await supabase
        .from("events")
        .update({ image_url: imageUrl })
        .eq("id", event.id);
      
      if (error) throw error;
      
      toast({
        title: "Image updated",
        description: "Event image has been updated successfully."
      });
      
      setIsEditingImage(false);
      if (refreshEvents) refreshEvents();
      
    } catch (error: any) {
      toast({
        title: "Error updating image",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setImageUpload(prev => ({ ...prev, uploading: false }));
    }
  };

  const cancelImageEdit = () => {
    setIsEditingImage(false);
    setImageUpload({
      file: null,
      preview: event.image_url || "",
      uploading: false
    });
  };

  if (!event.image_url) return null;

  return (
    <div className="relative">
      <img
        src={imageUpload.preview || event.image_url}
        alt={event.title}
        className="w-full h-48 object-cover rounded-lg"
      />
      {isCreator && (
        <div className="absolute top-2 right-2">
          {!isEditingImage ? (
            <Button
              size="sm"
              onClick={() => setIsEditingImage(true)}
              className="bg-black/50 hover:bg-black/70 text-white"
            >
              Change Image
            </Button>
          ) : (
            <div className="bg-white p-2 rounded-lg shadow-lg space-y-2">
              <ImageUpload
                label=""
                image={imageUpload}
                onChange={handleImageChange}
                loading={imageUpload.uploading}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={saveImage}
                  disabled={!imageUpload.file || imageUpload.uploading}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={cancelImageEdit}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
