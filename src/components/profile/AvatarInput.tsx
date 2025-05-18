
import React, { useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface AvatarInputProps {
  id: string;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  size?: string;
}

export function AvatarInput({
  id,
  preview,
  onChange,
  disabled = false,
  size = "w-32 h-32"
}: AvatarInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="relative inline-block">
      <div 
        className={`${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}`}
        onClick={handleAvatarClick}
      >
        <Avatar className={`${size} border-2 border-primary`}>
          {preview ? (
            <AvatarImage src={preview} alt="Profile avatar" />
          ) : (
            <AvatarFallback className="bg-muted">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 shadow-md">
          <Upload className="h-4 w-4 text-primary-foreground" />
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
