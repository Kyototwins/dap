
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
  "日本語",
  "英語",
  "中国語",
  "韓国語",
  "スペイン語",
  "フランス語"
];

const LANGUAGE_LEVELS = [
  { value: 1, label: "初級" },
  { value: 2, label: "中級" },
  { value: 3, label: "上級" },
  { value: 4, label: "ネイティブ" },
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
        <Label>言語スキル</Label>
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
                削除
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>初級</span>
                <span>中級</span>
                <span>上級</span>
                <span>ネイティブ</span>
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
              <SelectValue placeholder="言語を追加" />
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
        <Label>学習中の言語</Label>
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
