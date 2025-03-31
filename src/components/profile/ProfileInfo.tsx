
import { Edit } from "lucide-react";
import { Profile } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileAboutTab } from "./ProfileAboutTab";
import { ProfileCover } from "./ProfileCover";

interface ProfileInfoProps {
  profile: Profile;
  completion: number;
  onEditProfile: () => void;
}

export function ProfileInfo({ profile, completion, onEditProfile }: ProfileInfoProps) {
  const universitySuffix = profile.university ? 
    profile.department ? `、${profile.department}` : "" : "";
  
  const universityText = profile.university ? 
    `${profile.university}${universitySuffix}` : "大学情報未設定";

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
            className="flex-1 gap-2 bg-doshisha-purple hover:bg-doshisha-darkPurple"
          >
            <Edit className="w-4 h-4" />
            <span>プロフィールを編集</span>
          </Button>
        </div>
        
        {/* Profile completion */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">プロフィール完成度: {completion}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-doshisha-purple" 
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full bg-transparent border-b border-gray-200 rounded-none p-0 mb-6">
            <TabsTrigger 
              value="about" 
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-doshisha-purple data-[state=active]:text-doshisha-purple rounded-none"
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="connections" 
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-doshisha-purple data-[state=active]:text-doshisha-purple rounded-none"
            >
              Connections
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-doshisha-purple data-[state=active]:text-doshisha-purple rounded-none"
            >
              Events
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-0">
            <ProfileAboutTab profile={profile} />
          </TabsContent>
          
          <TabsContent value="connections">
            <div className="text-center py-8 text-gray-500">
              No connections yet
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <div className="text-center py-8 text-gray-500">
              No events yet
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
