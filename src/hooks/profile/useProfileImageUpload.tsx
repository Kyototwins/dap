
import { supabase } from "@/integrations/supabase/client";

export function useProfileImageUpload() {
  const uploadImage = async (file: File, path: string) => {
    if (!file) {
      console.error("File is undefined or null");
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      console.log(`Attempting to upload ${file.name} (${file.size} bytes) to ${filePath}`);

      const { error: uploadError, data } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      console.log("Upload successful:", filePath);

      const { data: { publicUrl } } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);

      console.log("Public URL generated:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("Error in uploadImage:", error);
      throw error;
    }
  };

  return { uploadImage };
}
