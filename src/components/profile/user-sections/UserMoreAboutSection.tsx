
import { Profile } from "@/types/messages";
import { Card, CardContent } from "@/components/ui/card";

interface UserMoreAboutSectionProps {
  profile: Profile;
}

export function UserMoreAboutSection({ profile }: UserMoreAboutSectionProps) {
  const hasAnyInfo = profile.best_quality || 
                    profile.life_goal || 
                    profile.superpower || 
                    profile.worst_nightmare || 
                    profile.friend_activity;
  
  if (!hasAnyInfo) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-medium text-lg mb-4">More About Me</h3>
        <div className="space-y-4">
          {profile.best_quality && (
            <div>
              <p className="text-gray-500 text-sm mb-1">My best quality is...</p>
              <p className="text-gray-700">{profile.best_quality}</p>
            </div>
          )}
          {profile.life_goal && (
            <div>
              <p className="text-gray-500 text-sm mb-1">My life goal...</p>
              <p className="text-gray-700">{profile.life_goal}</p>
            </div>
          )}
          {profile.superpower && (
            <div>
              <p className="text-gray-500 text-sm mb-1">If I could have one superpower...</p>
              <p className="text-gray-700">{profile.superpower}</p>
            </div>
          )}
          {profile.worst_nightmare && (
            <div>
              <p className="text-gray-500 text-sm mb-1">My worst nightmare is...</p>
              <p className="text-gray-700">{profile.worst_nightmare}</p>
            </div>
          )}
          {profile.friend_activity && (
            <div>
              <p className="text-gray-500 text-sm mb-1">If we become friends, I want to do...</p>
              <p className="text-gray-700">{profile.friend_activity}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
