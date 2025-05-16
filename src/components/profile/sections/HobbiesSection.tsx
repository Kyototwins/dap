
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

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
  const [customHobby, setCustomHobby] = useState("");

  // Ensure that hobbies is always an array
  const safeHobbies = Array.isArray(hobbies) ? hobbies : [];

  const hobbyOptions = [
    { value: "photography", label: "Photography" },
    { value: "hiking", label: "Hiking" },
    { value: "art", label: "Art" },
    { value: "reading", label: "Reading" },
    { value: "cooking", label: "Cooking" },
    { value: "traveling", label: "Traveling" },
    { value: "music", label: "Music" },
    { value: "sports", label: "Sports" },
    { value: "games", label: "Games" },
    { value: "programming", label: "Programming" },
  ];

  const addCustomHobby = () => {
    if (customHobby.trim() && !safeHobbies.includes(customHobby.trim())) {
      const newHobbies = [...safeHobbies, customHobby.trim()];
      onMultiSelectChange("hobbies", newHobbies);
      setCustomHobby("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomHobby();
    }
  };

  const toggleHobby = (hobby: string) => {
    if (safeHobbies.includes(hobby)) {
      onMultiSelectChange("hobbies", safeHobbies.filter(h => h !== hobby));
    } else {
      onMultiSelectChange("hobbies", [...safeHobbies, hobby]);
    }
  };

  // Get predefined hobby values
  const predefinedHobbyValues = hobbyOptions.map(option => option.value);
  // Filter custom hobbies (those not in predefined options)
  const customHobbies = safeHobbies.filter(hobby => !predefinedHobbyValues.includes(hobby));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Hobbies & Interests</h2>
      <Separator />
      
      <div className="space-y-4">
        <Label>Hobbies & Interests</Label>
        <div className="flex flex-wrap gap-2">
          {hobbyOptions.map((option) => (
            <Badge
              key={option.value}
              variant={safeHobbies.includes(option.value) ? "default" : "outline"}
              className={`cursor-pointer ${safeHobbies.includes(option.value) ? "bg-[#7F1184] hover:bg-[#671073]" : ""}`}
              onClick={() => toggleHobby(option.value)}
            >
              {option.label}
            </Badge>
          ))}
          <Badge
            variant="outline"
            className="bg-gray-100"
          >
            Other
          </Badge>
        </div>

        {customHobbies.length > 0 && (
          <div className="mt-2">
            <Label className="text-sm text-gray-600">Your custom hobbies:</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {customHobbies.map((hobby) => (
                <Badge
                  key={hobby}
                  variant="default"
                  className="bg-[#7F1184] hover:bg-[#671073] cursor-pointer"
                  onClick={() => toggleHobby(hobby)}
                >
                  {hobby} ×
                </Badge>
              ))}
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
}
