
import React, { useCallback } from "react";
import { ImageInput } from "./ImageInput";

interface ImageState {
  file: File | null;
  preview: string;
  uploading: boolean;
}

interface ImageUploadComponentProps {
  label: string;
  image: ImageState;
  setImage: (image: ImageState) => void;
  disabled?: boolean;
  aspectRatio?: number;
}

export function ImageUploadComponent({ 
  label, 
  image, 
  setImage,
  disabled = false,
  aspectRatio = 16 / 9
}: ImageUploadComponentProps) {
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

  const inputId = `image-upload-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="border rounded-md overflow-hidden bg-muted/20">
        <ImageInput
          id={inputId}
          preview={image.preview}
          onChange={handleFileChange}
          disabled={disabled}
          aspectRatio={aspectRatio}
        />
      </div>
    </div>
  );
}
