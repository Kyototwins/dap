
import React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { MultiSelect } from "@/components/ui/multi-select";

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
  const languageOptions = [
    { value: "english", label: "英語" },
    { value: "japanese", label: "日本語" },
    { value: "spanish", label: "スペイン語" },
    { value: "french", label: "フランス語" },
    { value: "german", label: "ドイツ語" },
    { value: "chinese", label: "中国語" },
    { value: "korean", label: "韓国語" },
    { value: "italian", label: "イタリア語" },
    { value: "russian", label: "ロシア語" },
    { value: "arabic", label: "アラビア語" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Language Skills</h2>
      <Separator />
      
      <div>
        <Label>Languages</Label>
        <MultiSelect
          options={languageOptions}
          value={languages}
          onChange={(values) => onMultiSelectChange("languages", values)}
          disabled={loading}
        />
      </div>
      
      {languages.map((language) => (
        <div key={language} className="space-y-2">
          <Label htmlFor={`${language}-level`}>{languageOptions.find(opt => opt.value === language)?.label}</Label>
          <div className="flex items-center space-x-4">
            <Slider
              id={`${language}-level`}
              defaultValue={[languageLevels[language] || 1]}
              max={5}
              step={1}
              onValueChange={(value) => onLanguageLevelChange(language, value[0])}
              disabled={loading}
            />
            <span>{languageLevels[language] || 1}</span>
          </div>
        </div>
      ))}
      
      <div>
        <h3 className="text-lg font-medium mb-2">Currently Learning</h3>
        <MultiSelect
          options={languageOptions}
          value={learningLanguages}
          onChange={(values) => onMultiSelectChange("learning_languages", values)}
          disabled={loading}
        />
      </div>
    </div>
  );
}
