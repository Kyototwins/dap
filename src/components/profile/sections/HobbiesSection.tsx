
import React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "@/components/ui/multi-select";

interface HobbiesSectionProps {
  hobbies: string[];
  onMultiSelectChange: (name: string, values: string[]) => void;
  loading?: boolean;
}

export function HobbiesSection({
  hobbies,
  onMultiSelectChange,
  loading
}: HobbiesSectionProps) {
  const hobbyOptions = [
    { value: "reading", label: "読書" },
    { value: "sports", label: "スポーツ" },
    { value: "travel", label: "旅行" },
    { value: "music", label: "音楽" },
    { value: "movies", label: "映画" },
    { value: "gaming", label: "ゲーム" },
    { value: "cooking", label: "料理" },
    { value: "photography", label: "写真" },
    { value: "art", label: "アート" },
    { value: "coding", label: "プログラミング" },
    { value: "hiking", label: "ハイキング" },
  ];

  // Ensure that hobbies is always an array
  const safeHobbies = Array.isArray(hobbies) ? hobbies : [];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Hobbies & Interests</h2>
      <Separator />
      
      <div>
        <Label>Hobbies</Label>
        <MultiSelect
          options={hobbyOptions}
          value={safeHobbies}
          onChange={(values) => onMultiSelectChange("hobbies", values)}
          disabled={loading}
        />
      </div>
    </div>
  );
}
