
import { ImageIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUpload {
  file: File | null;
  preview: string;
  uploading: boolean;
}

interface ImageUploadProps {
  label: string;
  image: ImageUpload;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
}

export function ImageUpload({ label, image, onChange, loading }: ImageUploadProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          {image.preview ? (
            <img
              src={image.preview}
              alt="Image preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={onChange}
            disabled={loading}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        {image.uploading && <Loader2 className="w-6 h-6 animate-spin" />}
      </div>
    </div>
  );
}
