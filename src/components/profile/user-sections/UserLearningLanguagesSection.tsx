
import { Profile } from "@/types/messages";
import { Card, CardContent } from "@/components/ui/card";

interface UserLearningLanguagesSectionProps {
  profile: Profile;
}

export function UserLearningLanguagesSection({ profile }: UserLearningLanguagesSectionProps) {
  if (!profile.learning_languages || profile.learning_languages.length === 0) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-medium text-lg mb-4">Languages I'm Learning</h3>
        <div className="flex flex-wrap gap-2">
          {profile.learning_languages.map((language, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
            >
              {language}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
