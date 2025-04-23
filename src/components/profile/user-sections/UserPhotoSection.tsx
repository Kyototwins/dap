
import { Profile } from "@/types/messages";
import { Card, CardContent } from "@/components/ui/card";

interface UserPhotoSectionProps {
  profile: Profile;
}

export function UserPhotoSection({ profile }: UserPhotoSectionProps) {
  // Only display this section if there's an image to show
  if (!profile.image_url_2) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="overflow-hidden rounded-lg">
          <img 
            src={profile.image_url_2} 
            alt="Additional photo" 
            className="w-full object-cover h-auto max-h-96"
            onError={(e) => {
              console.error("Image load error:", e);
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          {profile.photo_comment && (
            <p className="mt-3 text-gray-600 italic">{profile.photo_comment}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
