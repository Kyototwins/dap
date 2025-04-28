
import { FilterBadge } from "./FilterBadge";

const HOBBY_OPTIONS = [
  "Traveling", "Cooking", "Watching Movies", "Reading", "Music", "Sports", "Art", 
  "Photography", "Dancing", "Gaming", "Programming", "Languages"
];

interface HobbySelectorProps {
  selectedHobbies: string[];
  onToggleHobby: (hobby: string) => void;
}

export function HobbySelector({ selectedHobbies, onToggleHobby }: HobbySelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium border-b pb-2">Hobbies & Interests</h3>
      <div className="flex flex-wrap gap-2">
        {HOBBY_OPTIONS.map(hobby => (
          <FilterBadge
            key={hobby}
            label={hobby}
            isSelected={selectedHobbies.includes(hobby)}
            onClick={() => onToggleHobby(hobby)}
          />
        ))}
      </div>
    </div>
  );
}

