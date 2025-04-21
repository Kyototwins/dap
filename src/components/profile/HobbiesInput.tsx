
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

const HOBBY_OPTIONS = [
  "Photography",
  "Hiking",
  "Art",
  "Reading",
  "Cooking",
  "Traveling",
  "Music",
  "Sports",
  "Games",
  "Programming"
];

interface HobbiesInputProps {
  hobbies: string[];
  onChange: (name: string, value: string[]) => void;
  loading?: boolean;
}

export function HobbiesInput({ hobbies, onChange, loading }: HobbiesInputProps) {
  const [customHobby, setCustomHobby] = useState("");

  const addCustomHobby = () => {
    if (customHobby.trim() && !hobbies?.includes(customHobby.trim())) {
      const newHobbies = [...(hobbies || []), customHobby.trim()];
      onChange("hobbies", newHobbies);
      setCustomHobby("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomHobby();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Hobbies & Interests</Label>
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
          <Badge
            variant="outline"
            className="bg-gray-100"
          >
            Other
          </Badge>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add your own hobby or interest"
          value={customHobby}
          onChange={(e) => setCustomHobby(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="flex-1"
        />
        <Button 
          type="button" 
          size="icon" 
          variant="outline" 
          onClick={addCustomHobby}
          disabled={loading || !customHobby.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {hobbies?.filter(hobby => !HOBBY_OPTIONS.includes(hobby)).length > 0 && (
        <div className="mt-2">
          <Label className="text-sm text-gray-600">Your custom hobbies:</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {hobbies?.filter(hobby => !HOBBY_OPTIONS.includes(hobby)).map((hobby) => (
              <Badge
                key={hobby}
                variant="default"
                className="cursor-pointer"
                onClick={() => {
                  if (loading) return;
                  const newHobbies = hobbies.filter(h => h !== hobby);
                  onChange("hobbies", newHobbies);
                }}
              >
                {hobby} ×
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
