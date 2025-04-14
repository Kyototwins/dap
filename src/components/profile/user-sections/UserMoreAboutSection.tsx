
import { Profile } from "@/types/messages";
import { Card, CardContent } from "@/components/ui/card";

interface UserMoreAboutSectionProps {
  profile: Profile;
}

export function UserMoreAboutSection({ profile }: UserMoreAboutSectionProps) {
  // Check if any of the additional fields exist
  const hasAdditionalInfo = profile.life_goal || 
                           profile.superpower || 
                           profile.worst_nightmare || 
                           profile.friend_activity || 
                           profile.best_quality;
  
  if (!hasAdditionalInfo) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-medium text-lg mb-4">More About Me</h3>
        <div className="space-y-4">
          {profile.best_quality && (
            <div>
              <h4 className="text-gray-500 font-medium mb-1">My best quality is...</h4>
              <p>{profile.best_quality}</p>
            </div>
          )}
          {profile.life_goal && (
            <div>
              <h4 className="text-gray-500 font-medium mb-1">My life goal...</h4>
              <p>{profile.life_goal}</p>
            </div>
          )}
          {profile.superpower && (
            <div>
              <h4 className="text-gray-500 font-medium mb-1">If I could have a superpower...</h4>
              <p>{profile.superpower}</p>
            </div>
          )}
          {profile.worst_nightmare && (
            <div>
              <h4 className="text-gray-500 font-medium mb-1">My worst nightmare is...</h4>
              <p>{profile.worst_nightmare}</p>
            </div>
          )}
          {profile.friend_activity && (
            <div>
              <h4 className="text-gray-500 font-medium mb-1">If we become friends, I want to do...</h4>
              <p>{profile.friend_activity}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
