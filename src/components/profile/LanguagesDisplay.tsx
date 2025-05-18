
import { Profile } from "@/types/messages";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Languages } from "lucide-react";

interface LanguagesDisplayProps {
  profile: Profile;
}

export function LanguagesDisplay({ profile }: LanguagesDisplayProps) {
  if ((!profile.languages || profile.languages.length === 0) && 
      (!profile.learning_languages || profile.learning_languages.length === 0)) {
    return null;
  }

  const languageLevels = profile.language_levels 
    ? typeof profile.language_levels === 'string'
      ? JSON.parse(profile.language_levels)
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
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Languages className="w-5 h-5 text-amber-600" />
        <h2 className="text-lg font-semibold">Language Skills</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.languages && profile.languages.length > 0 && (
          <div className="space-y-4">
            {profile.languages.map((lang) => (
              <div key={lang} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{lang}</h3>
                  <Badge variant="outline">{languageLevelText(languageLevels[lang] || 1)}</Badge>
                </div>
                <Progress value={(languageLevels[lang] || 1) * 25} className="h-2" />
              </div>
            ))}
          </div>
        )}

        {profile.learning_languages && profile.learning_languages.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Currently Learning</h3>
            <div className="flex flex-wrap gap-2">
              {profile.learning_languages.map((lang) => (
                <Badge key={lang} variant="outline">{lang}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

