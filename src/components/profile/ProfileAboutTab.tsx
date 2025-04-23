
import { Profile } from "@/types/messages";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileAboutTabProps {
  profile: Profile;
}

export function ProfileAboutTab({ profile }: ProfileAboutTabProps) {
  const languageLevels = profile.language_levels 
    ? typeof profile.language_levels === 'string'
      ? JSON.parse(profile.language_levels as string) 
      : profile.language_levels
    : {};

  const languageLevelText = (level: number) => {
    const levels = [
      { value: 1, label: "Beginner" },
      { value: 2, label: "Intermediate" },
      { value: 3, label: "Advanced" },
      { value: 4, label: "Native" },
    ];
    return levels.find(l => l.value === level)?.label || "Beginner";
  };

  return (
    <div className="space-y-6">
      {/* About Me */}
      <div className="p-6 border border-gray-200 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">About Me</h2>
        <p className="text-gray-700 whitespace-pre-wrap break-words">
          {profile.about_me || "No introduction provided yet."}
        </p>
      </div>
      
      {/* Additional Photo */}
      {profile.image_url_2 && (
        <div className="p-6 border border-gray-200 rounded-lg mb-6">
          <div className="overflow-hidden rounded-lg">
            <img 
              src={profile.image_url_2} 
              alt="Additional Photo" 
              className="w-full h-auto max-h-96 object-contain"
            />
            {profile.photo_comment && (
              <p className="mt-3 text-gray-600 italic">{profile.photo_comment}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <div className="p-6 border border-gray-200 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Languages</h2>
          <div className="space-y-4">
            {profile.languages.map((language, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{language}</span>
                  <span className="px-4 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {languageLevelText(languageLevels[language] || 1)}
                  </span>
                </div>
                <Progress value={(languageLevels[language] || 1) * 25} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Learning Languages */}
      {profile.learning_languages && profile.learning_languages.length > 0 && (
        <div className="p-6 border border-gray-200 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Learning Languages</h2>
          <div className="flex flex-wrap gap-2">
            {profile.learning_languages.map((lang, index) => (
              <Badge key={index} variant="outline">{lang}</Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Hobby Photo */}
      {profile.hobby_photo_url && (
        <div className="p-6 border border-gray-200 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">My Hobby Photo</h2>
          <div className="overflow-hidden rounded-lg">
            <img 
              src={profile.hobby_photo_url} 
              alt="Hobby Photo" 
              className="w-full h-auto max-h-96 object-contain"
            />
            {profile.hobby_photo_comment && (
              <p className="mt-3 text-gray-600 italic">{profile.hobby_photo_comment}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Hobbies/Interests */}
      {profile.hobbies && profile.hobbies.length > 0 && (
        <div className="p-6 border border-gray-200 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.hobbies.map((hobby, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {hobby}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Pet Photo */}
      {profile.pet_photo_url && (
        <div className="p-6 border border-gray-200 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">My Pet Photo</h2>
          <div className="overflow-hidden rounded-lg">
            <img 
              src={profile.pet_photo_url} 
              alt="Pet Photo" 
              className="w-full h-auto max-h-96 object-contain"
            />
            {profile.pet_photo_comment && (
              <p className="mt-3 text-gray-600 italic">{profile.pet_photo_comment}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Additional Questions */}
      <div className="p-6 border border-gray-200 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">More About Me</h2>
        <div className="space-y-4">
          {profile.best_quality && (
            <div>
              <h3 className="text-gray-500 font-medium mb-1">My best quality is...</h3>
              <p>{profile.best_quality}</p>
            </div>
          )}
          {profile.life_goal && (
            <div>
              <h3 className="text-gray-500 font-medium mb-1">My life goal...</h3>
              <p>{profile.life_goal}</p>
            </div>
          )}
          {profile.superpower && (
            <div>
              <h3 className="text-gray-500 font-medium mb-1">If I could have a superpower...</h3>
              <p>{profile.superpower}</p>
            </div>
          )}
          {profile.worst_nightmare && (
            <div>
              <h3 className="text-gray-500 font-medium mb-1">My worst nightmare is...</h3>
              <p>{profile.worst_nightmare}</p>
            </div>
          )}
          {profile.friend_activity && (
            <div>
              <h3 className="text-gray-500 font-medium mb-1">If we become friends, I want to do...</h3>
              <p>{profile.friend_activity}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
