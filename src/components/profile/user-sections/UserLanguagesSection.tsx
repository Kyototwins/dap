
import { Profile } from "@/types/messages";
import { Card, CardContent } from "@/components/ui/card";

interface UserLanguagesSectionProps {
  profile: Profile;
}

export function UserLanguagesSection({ profile }: UserLanguagesSectionProps) {
  if (!profile.languages || profile.languages.length === 0) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-medium text-lg mb-4">Languages I Speak</h3>
        <div className="flex flex-wrap gap-2">
          {profile.languages.map((language, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-doshisha-lightPurple/20 text-doshisha-purple rounded-full text-sm"
            >
              {language}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
