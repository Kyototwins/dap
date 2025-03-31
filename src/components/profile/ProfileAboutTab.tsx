
import { Profile } from "@/types/messages";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
      { value: 1, label: "初級" },
      { value: 2, label: "中級" },
      { value: 3, label: "上級" },
      { value: 4, label: "ネイティブ" },
    ];
    return levels.find(l => l.value === level)?.label || "初級";
  };

  return (
    <>
      <div className="dap-card p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">About Me</h2>
        <p className="text-gray-700 whitespace-pre-wrap break-words">
          {profile.about_me || "自己紹介文が設定されていません。"}
        </p>
      </div>
      
      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <div className="dap-card p-6 mb-6">
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
        <div className="dap-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Learning Languages</h2>
          <div className="flex flex-wrap gap-2">
            {profile.learning_languages.map((lang, index) => (
              <Badge key={index} variant="outline">{lang}</Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Hobbies/Interests */}
      {profile.hobbies && profile.hobbies.length > 0 && (
        <div className="dap-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.hobbies.map((hobby, index) => (
              <span key={index} className="dap-tag">{hobby}</span>
            ))}
          </div>
        </div>
      )}
      
      {/* Additional Questions */}
      <div className="dap-card p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">More About Me</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-500 font-medium mb-1">理想のデート</h3>
            <p>{profile.ideal_date || "未設定"}</p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium mb-1">人生の目標</h3>
            <p>{profile.life_goal || "未設定"}</p>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium mb-1">欲しい超能力</h3>
            <p>{profile.superpower || "未設定"}</p>
          </div>
        </div>
      </div>
    </>
  );
}
