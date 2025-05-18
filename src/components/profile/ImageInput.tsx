
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImageInputProps {
  id: string;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  aspectRatio?: number;
}

export function ImageInput({
  id,
  preview,
  onChange,
  disabled = false,
  aspectRatio = 16 / 9
}: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="relative w-full">
      <AspectRatio ratio={aspectRatio} className="bg-muted overflow-hidden rounded-md">
        {preview ? (
          <img
            src={preview}
            alt="Image preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <ImageIcon className="h-10 w-10 text-muted-foreground opacity-50" />
          </div>
        )}
      </AspectRatio>
      
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity ${
          disabled ? 'pointer-events-none' : 'cursor-pointer'
        }`}
        onClick={handleButtonClick}
      >
        <div className="flex flex-col items-center gap-2 text-white">
          <Upload className="h-6 w-6" />
          <span className="text-sm font-medium">Upload Image</span>
        </div>
      </div>
      
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
