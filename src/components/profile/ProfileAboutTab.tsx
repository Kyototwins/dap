
import { Profile } from "@/types/messages";

interface ProfileAboutTabProps {
  profile: Profile;
}

export function ProfileAboutTab({ profile }: ProfileAboutTabProps) {
  return (
    <>
      <div className="dap-card p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">About Me</h2>
        <p className="text-gray-700 whitespace-pre-wrap break-words">
          {profile.about_me || "自己紹介文が設定されていません。"}
        </p>
      </div>
      
      {profile.languages && profile.languages.length > 0 && (
        <div className="dap-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Languages</h2>
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((language, index) => (
              <span key={index} className="dap-tag-blue">{language}</span>
            ))}
          </div>
        </div>
      )}
      
      {profile.hobbies && profile.hobbies.length > 0 && (
        <div className="dap-card p-6">
          <h2 className="text-xl font-bold mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.hobbies.map((hobby, index) => (
              <span key={index} className="dap-tag">{hobby}</span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
