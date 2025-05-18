
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
}

export function ImageUploadComponent({ 
  label, 
  image, 
  setImage,
  disabled = false
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
        <div className="relative">
          {image.preview ? (
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <img
                src={image.preview}
                alt={label}
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          ) : (
            <AspectRatio ratio={16 / 9} className="bg-muted flex items-center justify-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground opacity-50" />
            </AspectRatio>
          )}
          
          <label
            htmlFor={inputId}
            className={`absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer ${
              disabled ? 'pointer-events-none' : ''
            }`}
          >
            <div className="flex flex-col items-center gap-2 text-white">
              <Upload className="h-6 w-6" />
              <span className="text-sm font-medium">Upload Image</span>
            </div>
          </label>
        </div>
        
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
