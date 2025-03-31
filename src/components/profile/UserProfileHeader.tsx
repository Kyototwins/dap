
import { Profile } from "@/types/messages";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserProfileHeaderProps {
  profile: Profile;
}

export function UserProfileHeader({ profile }: UserProfileHeaderProps) {
  return (
    <div className="relative -mt-16 flex flex-col items-center px-4 z-10 mb-6">
      <Avatar className="w-32 h-32 border-4 border-white">
        <AvatarImage
          src={profile.avatar_url || "/placeholder.svg"}
          alt={`${profile.first_name || ''} ${profile.last_name || ''}`}
          onError={(e) => {
            console.error("Avatar image load error:", e);
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <AvatarFallback>
          {profile.first_name?.[0]}
          {profile.last_name?.[0]}
        </AvatarFallback>
      </Avatar>
      <h1 className="mt-4 text-2xl font-bold">
        {profile.first_name} {profile.last_name}
      </h1>
      <div className="mt-2 flex gap-2 flex-wrap justify-center">
        {profile.age && <Badge variant="secondary">{profile.age}</Badge>}
        {profile.gender && <Badge variant="secondary">{profile.gender}</Badge>}
        {profile.origin && <Badge variant="secondary">{profile.origin}</Badge>}
      </div>
    </div>
  );
}
