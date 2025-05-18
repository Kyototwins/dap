
import React, { useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImageState {
  file: File | null;
  preview: string;
  uploading: boolean;
}

interface AvatarUploadProps {
  image: ImageState;
  setImage: (image: ImageState) => void;
  disabled?: boolean;
}

export function AvatarUpload({ image, setImage, disabled = false }: AvatarUploadProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImage({
        file,
        preview,
        uploading: false
      });
    }
  }, [setImage]);

  return (
    <div className="flex flex-col items-center gap-4">
      <label 
        className={`relative cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
        htmlFor="avatar-upload"
      >
        <Avatar className="w-32 h-32 border-2 border-primary">
          {image.preview ? (
            <AvatarImage src={image.preview} alt="Profile avatar" />
          ) : (
            <AvatarFallback className="bg-muted">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 shadow-md">
          <Upload className="h-4 w-4 text-primary-foreground" />
        </div>
      </label>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <span className="text-sm text-muted-foreground">プロフィール写真</span>
    </div>
  );
}
