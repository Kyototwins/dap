
import { Profile } from "@/types/messages";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface UserProfileAboutTabProps {
  profile: Profile;
}

export function UserProfileAboutTab({ profile }: UserProfileAboutTabProps) {
  const languageLevels = profile.language_levels 
    ? typeof profile.language_levels === 'string'
      ? JSON.parse(profile.language_levels as string) 
      : profile.language_levels
    : {};

  const languageLevelText = (level: number) => {
    const levels = [
      { value: 1, label: "初級" },
      { value: 2, label: "中級" },
      { value: 3, label: "上級" },
      { value: 4, label: "ネイティブ" },
    ];
    return levels.find(l => l.value === level)?.label || "初級";
  };

  return (
    <>
      {/* About Me */}
      <div className="dap-card p-6">
        <h2 className="text-xl font-bold mb-4">About Me</h2>
        <p className="text-gray-700 whitespace-pre-wrap break-words">
          {profile.about_me || "自己紹介文が設定されていません。"}
        </p>
      </div>
      
      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <div className="dap-card p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Languages</h2>
          <div className="space-y-4">
            {profile.languages.map((lang, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{lang}</div>
                  <div className={`px-4 py-1 rounded-full text-sm ${
                    index === 0 ? "bg-blue-100 text-blue-800" : 
                    index === 1 ? "bg-green-100 text-green-800" : 
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {index === 0 ? "Native" : index === 1 ? "Fluent" : "Learning"}
                  </div>
                </div>
                <Progress value={(languageLevels[lang] || 1) * 25} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Interests/Hobbies */}
      {profile.hobbies && profile.hobbies.length > 0 && (
        <div className="dap-card p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.hobbies.map((hobby, index) => (
              <Badge key={index} variant="secondary">{hobby}</Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Academic Info */}
      {profile.university && (
        <div className="dap-card p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Academic Info</h2>
          <div className="space-y-4">
            <div>
              <div className="text-gray-500">University</div>
              <div className="font-medium">{profile.university}</div>
            </div>
            {profile.department && (
              <div>
                <div className="text-gray-500">Faculty</div>
                <div className="font-medium">{profile.department}</div>
              </div>
            )}
            <div>
              <div className="text-gray-500">Year</div>
              <div className="font-medium">{profile.year}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats */}
      <div className="dap-card p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Stats</h2>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-doshisha-purple">27</div>
            <div className="text-gray-500">Connections</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-doshisha-purple">12</div>
            <div className="text-gray-500">Events</div>
          </div>
        </div>
      </div>
    </>
  );
}
