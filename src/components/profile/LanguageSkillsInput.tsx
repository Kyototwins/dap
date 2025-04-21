
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGE_OPTIONS = [
  "Japanese",
  "English",
  "Chinese",
  "Korean",
  "Spanish",
  "French"
];

const LANGUAGE_LEVELS = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Intermediate" },
  { value: 3, label: "Advanced" },
  { value: 4, label: "Native" },
];

interface LanguageSkillsInputProps {
  languages: string[];
  languageLevels: Record<string, number>;
  learningLanguages: string[];
  onChange: (name: string, value: string[] | Record<string, number>) => void;
  loading?: boolean;
}

export function LanguageSkillsInput({
  languages,
  languageLevels,
  learningLanguages,
  onChange,
  loading
}: LanguageSkillsInputProps) {
  return (
    <>
      <div className="space-y-4">
        <Label>Language Skills</Label>
        {languages.map((lang) => (
          <div key={lang} className="space-y-2 p-3 border rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">{lang}</span>
              <Badge 
                variant="outline" 
                className="cursor-pointer"
                onClick={() => {
                  const newLangs = languages.filter(l => l !== lang);
                  onChange("languages", newLangs);
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
                value={[languageLevels[lang] || 1]}
                min={1}
                max={4}
                step={1}
                onValueChange={(value) => {
                  const newLevels = { ...languageLevels, [lang]: value[0] };
                  onChange("languageLevels", newLevels);
                }}
                disabled={loading}
              />
              <div className="text-sm text-right text-muted-foreground">
                {LANGUAGE_LEVELS.find(l => l.value === (languageLevels[lang] || 1))?.label}
              </div>
            </div>
          </div>
        ))}
        <div className="mt-2">
          <Select
            onValueChange={(value) => {
              if (!languages.includes(value)) {
                const newLangs = [...languages, value];
                const newLevels = { ...languageLevels, [value]: 1 };
                onChange("languages", newLangs);
                onChange("languageLevels", newLevels);
              }
            }}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Add a language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.filter(lang => !languages.includes(lang)).map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Currently Learning</Label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => (
            <Badge
              key={lang}
              variant={learningLanguages?.includes(lang) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                const newLangs = learningLanguages?.includes(lang)
                  ? learningLanguages.filter(l => l !== lang)
                  : [...(learningLanguages || []), lang];
                onChange("learning_languages", newLangs);
              }}
              aria-disabled={loading}
            >
              {lang}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}

