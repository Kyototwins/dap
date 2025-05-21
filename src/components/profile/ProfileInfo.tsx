
import { Edit } from "lucide-react";
import { Profile } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ProfileAboutTab } from "./ProfileAboutTab";
import { ProfileCover } from "./ProfileCover";

interface ProfileInfoProps {
  profile: Profile;
  completion: number;
  onEditProfile: () => void;
}

export function ProfileInfo({ profile, completion, onEditProfile }: ProfileInfoProps) {
  const universitySuffix = profile.university ? 
    profile.department ? `, ${profile.department}` : "" : "";
  
  const universityText = profile.university ? 
    `${profile.university}${universitySuffix}` : "University info not set";

  return (
    <div className="pb-6">
      {/* Cover image */}
      <ProfileCover imageUrl={profile.image_url_1} />
      
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
      
      {/* Profile information */}
      <div className="px-4">
        <h1 className="text-3xl font-bold mb-1">
          {profile.first_name} {profile.last_name}
        </h1>
        <p className="text-gray-600 mb-4">{universityText}</p>
        
        {/* Action button - profile edit button only */}
        <div className="flex mb-6">
          <Button 
            onClick={onEditProfile}
            className="flex-1 gap-2 bg-[#7f1184] hover:bg-[#671073]"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
        
        {/* Profile completion */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Profile completion: {completion}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#7f1184]" 
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
        
        {/* Show profile content without "About" heading */}
        <div className="w-full">
          <ProfileAboutTab profile={profile} />
        </div>
      </div>
    </div>
  );
}
