
import React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSectionProps {
  languages: string[];
  languageLevels: Record<string, number>;
  learningLanguages: string[];
  onMultiSelectChange: (name: string, values: string[]) => void;
  onLanguageLevelChange: (language: string, level: number) => void;
  loading?: boolean;
}

export function LanguageSection({
  languages,
  languageLevels,
  learningLanguages,
  onMultiSelectChange,
  onLanguageLevelChange,
  loading
}: LanguageSectionProps) {
  // Ensure arrays are safe
  const safeLanguages = Array.isArray(languages) ? languages : [];
  const safeLearningLanguages = Array.isArray(learningLanguages) ? learningLanguages : [];
  
  const languageOptions = [
    { value: "english", label: "English" },
    { value: "japanese", label: "Japanese" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "chinese", label: "Chinese" },
    { value: "korean", label: "Korean" },
    { value: "italian", label: "Italian" },
    { value: "russian", label: "Russian" },
    { value: "arabic", label: "Arabic" },
  ];

  const toggleLearningLanguage = (language: string) => {
    if (safeLearningLanguages.includes(language)) {
      onMultiSelectChange("learning_languages", safeLearningLanguages.filter(l => l !== language));
    } else {
      onMultiSelectChange("learning_languages", [...safeLearningLanguages, language]);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Language Skills</h2>
      <Separator />
      
      <div>
        <Label>Language Skills</Label>
        {safeLanguages.map((language) => (
          <div key={language} className="space-y-2 p-3 border rounded-md mb-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">{languageOptions.find(opt => opt.value === language)?.label || language}</span>
              <Badge 
                variant="outline" 
                className="cursor-pointer"
                onClick={() => {
                  if (loading) return;
                  const newLanguages = safeLanguages.filter(l => l !== language);
                  onMultiSelectChange("languages", newLanguages);
                }}
              >
                Remove
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Advanced</span>
                <span>Native</span>
              </div>
              <Slider
                value={[languageLevels[language] || 1]}
                min={1}
                max={4}
                step={1}
                onValueChange={(value) => onLanguageLevelChange(language, value[0])}
                disabled={loading}
                className="bg-purple-100"
              />
              <div className="text-right text-sm">
                {languageLevels[language] === 1 && "Beginner"}
                {languageLevels[language] === 2 && "Intermediate"}
                {languageLevels[language] === 3 && "Advanced"}
                {languageLevels[language] === 4 && "Native"}
              </div>
            </div>
          </div>
        ))}
        
        <Select
          onValueChange={(value) => {
            if (!safeLanguages.includes(value)) {
              onMultiSelectChange("languages", [...safeLanguages, value]);
              onLanguageLevelChange(value, 1);
            }
          }}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Add a language" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions
              .filter(lang => !safeLanguages.includes(lang.value))
              .map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Currently Learning</h3>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map((lang) => (
            <Badge
              key={lang.value}
              variant={safeLearningLanguages.includes(lang.value) ? "default" : "outline"}
              className={`cursor-pointer ${safeLearningLanguages.includes(lang.value) ? "bg-purple-600 hover:bg-purple-700" : ""}`}
              onClick={() => toggleLearningLanguage(lang.value)}
            >
              {lang.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
