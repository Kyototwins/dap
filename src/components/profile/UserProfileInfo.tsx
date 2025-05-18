
import { Profile } from "@/types/messages";
import { UserProfileCover } from "./UserProfileCover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface UserProfileInfoProps {
  profile: Profile;
}

export function UserProfileInfo({ profile }: UserProfileInfoProps) {
  const universitySuffix = profile.university ? 
    profile.department ? `, ${profile.department}` : "" : "";
  
  const universityText = profile.university ? 
    `${profile.university}${universitySuffix}` : "University info not set";

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow">
      {/* Cover image */}
      <UserProfileCover imageUrl={profile.image_url_1} />
      
      {/* Profile header with avatar */}
      <div className="relative px-4 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center -mt-16 mb-4">
          <Avatar className="w-32 h-32 border-4 border-white shadow-md">
            <AvatarImage
              src={profile.avatar_url || "/placeholder.svg"}
              alt={`${profile.first_name} ${profile.last_name}`}
            />
            <AvatarFallback className="text-2xl">
              {profile.first_name?.[0]}
              {profile.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <h1 className="text-3xl font-bold">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-gray-600">{universityText}</p>
          </div>
        </div>
        
        {/* Basic info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-4">
            <h2 className="font-semibold text-lg mb-2">About</h2>
            <p className="text-gray-700">{profile.about_me || "No information provided."}</p>
          </Card>
          
          {/* Display languages */}
          <Card className="p-4">
            <h2 className="font-semibold text-lg mb-2">Languages</h2>
            {profile.languages && profile.languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((language) => (
                  <span 
                    key={language}
                    className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No languages specified.</p>
            )}
          </Card>
        </div>
        
        {/* Hobbies */}
        {profile.hobbies && profile.hobbies.length > 0 && (
          <div className="mb-6">
            <Card className="p-4">
              <h2 className="font-semibold text-lg mb-2">Hobbies & Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.hobbies.map((hobby) => (
                  <span 
                    key={hobby}
                    className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        )}
        
        {/* Additional photos if available */}
        {(profile.image_url_2 || profile.hobby_photo_url) && (
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Photos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.image_url_2 && (
                <div className="aspect-video rounded-md overflow-hidden">
                  <img 
                    src={profile.image_url_2} 
                    alt="User photo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {profile.hobby_photo_url && (
                <div className="aspect-video rounded-md overflow-hidden">
                  <img 
                    src={profile.hobby_photo_url} 
                    alt="Hobby photo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
