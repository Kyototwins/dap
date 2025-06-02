
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SortOptionsProps {
  sortOption: string;
  onSortChange: (value: string) => void;
}

export function SortOptions({ sortOption, onSortChange }: SortOptionsProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium border-b pb-2">Sort Options</h3>
      <RadioGroup value={sortOption} onValueChange={onSortChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="random" id="random" />
          <Label htmlFor="random" className="text-sm">Random</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="alphabetical" id="alphabetical" />
          <Label htmlFor="alphabetical" className="text-sm">Alphabetical</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
