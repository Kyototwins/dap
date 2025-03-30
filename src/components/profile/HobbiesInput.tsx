
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const HOBBY_OPTIONS = [
  "写真",
  "ハイキング",
  "アート",
  "読書",
  "料理",
  "旅行",
  "音楽",
  "スポーツ",
  "ゲーム",
  "プログラミング"
];

interface HobbiesInputProps {
  hobbies: string[];
  onChange: (name: string, value: string[]) => void;
  loading?: boolean;
}

export function HobbiesInput({ hobbies, onChange, loading }: HobbiesInputProps) {
  return (
    <div className="space-y-2">
      <Label>趣味・興味</Label>
      <div className="flex flex-wrap gap-2">
        {HOBBY_OPTIONS.map((hobby) => (
          <Badge
            key={hobby}
            variant={hobbies?.includes(hobby) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => {
              if (loading) return;
              const newHobbies = hobbies?.includes(hobby)
                ? hobbies.filter(h => h !== hobby)
                : [...(hobbies || []), hobby];
              onChange("hobbies", newHobbies);
            }}
          >
            {hobby}
          </Badge>
        ))}
      </div>
    </div>
  );
}
