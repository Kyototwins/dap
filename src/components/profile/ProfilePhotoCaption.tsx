
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfilePhotoCaptionProps {
  caption: string;
  onChange: (caption: string) => void;
  loading?: boolean;
}

export function ProfilePhotoCaption({ caption, onChange, loading }: ProfilePhotoCaptionProps) {
  return (
    <div className="space-y-2">
      <Label>Photo Comment</Label>
      <Textarea
        placeholder="Share something about this photo..."
        value={caption}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[80px]"
        disabled={loading}
      />
    </div>
  );
}
