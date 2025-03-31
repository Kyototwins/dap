
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types/messages";

interface UserProfileHeaderProps {
  profile: Profile;
}

export function UserProfileHeader({ profile }: UserProfileHeaderProps) {
  return (
    <>
      {/* Profile avatar */}
      <div className="relative -mt-16 px-4 mb-4">
        <Avatar className="w-32 h-32 border-4 border-white shadow-md">
          <AvatarImage
            src={profile.avatar_url || "/placeholder.svg"}
            alt="Profile"
          />
          <AvatarFallback className="text-2xl">
            {profile.first_name?.[0]}
            {profile.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
      </div>
      
      {/* Profile info */}
      <div className="px-4">
        <h1 className="text-3xl font-bold mb-1">
          {profile.first_name} {profile.last_name}
        </h1>
        <p className="text-gray-600 mb-4">
          {profile.university ? `${profile.university}${profile.department ? `, ${profile.department}` : ''}` : ''}
        </p>
      </div>
    </>
  );
}
