
import { FilterBadge } from "./FilterBadge";

const LANGUAGE_OPTIONS = [
  { value: "japanese", label: "Japanese" },
  { value: "english", label: "English" },
  { value: "chinese", label: "Chinese" },
  { value: "korean", label: "Korean" },
  { value: "french", label: "French" },
  { value: "spanish", label: "Spanish" },
];

interface LanguageSelectorProps {
  title: string;
  selectedLanguages: string[];
  onToggleLanguage: (lang: string) => void;
}

export function LanguageSelector({ 
  title, 
  selectedLanguages, 
  onToggleLanguage 
}: LanguageSelectorProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {LANGUAGE_OPTIONS.map(lang => (
          <FilterBadge
            key={lang.value}
            label={lang.label}
            isSelected={selectedLanguages.includes(lang.label)}
            onClick={() => onToggleLanguage(lang.label)}
          />
        ))}
      </div>
    </div>
  );
}

