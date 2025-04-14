
import { Profile } from "@/types/messages";
import { Card, CardContent } from "@/components/ui/card";

interface UserHobbiesSectionProps {
  profile: Profile;
}

export function UserHobbiesSection({ profile }: UserHobbiesSectionProps) {
  if (!profile.hobbies || profile.hobbies.length === 0) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-medium text-lg mb-4">Hobbies & Interests</h3>
        <div className="flex flex-wrap gap-2">
          {profile.hobbies.map((hobby, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {hobby}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
