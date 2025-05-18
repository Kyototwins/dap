
import { Edit2, Languages } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Profile } from "@/types/messages";

interface LanguageSkillsProps {
  profile: Profile;
  onEditClick: () => void;
}

export function LanguageSkills({ profile, onEditClick }: LanguageSkillsProps) {
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold">Language Skills</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onEditClick}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.languages && profile.languages.length > 0 ? (
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
        ) : (
          <p className="text-muted-foreground">No language skills set</p>
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
