
import React, { useCallback } from "react";
import { AvatarInput } from "./AvatarInput";

interface ImageState {
  file: File | null;
  preview: string;
  uploading: boolean;
}

interface AvatarUploadProps {
  image: ImageState;
  setImage: (image: ImageState) => void;
  disabled?: boolean;
  size?: string;
}

export function AvatarUpload({ 
  image, 
  setImage, 
  disabled = false,
  size = "w-32 h-32"
}: AvatarUploadProps) {
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
      <AvatarInput
        id="avatar-upload"
        preview={image.preview}
        onChange={handleFileChange}
        disabled={disabled}
        size={size}
      />
      <span className="text-sm text-muted-foreground">Profile Picture</span>
    </div>
  );
}
