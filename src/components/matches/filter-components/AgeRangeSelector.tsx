
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface AgeRangeSelectorProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function AgeRangeSelector({ value, onChange }: AgeRangeSelectorProps) {
  const handleMinAgeChange = (newValue: number[]) => {
    const minAge = Math.min(newValue[0], value[1]);
    onChange([minAge, value[1]]);
  };

  const handleMaxAgeChange = (newValue: number[]) => {
    const maxAge = Math.max(newValue[0], value[0]);
    onChange([value[0], maxAge]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium border-b pb-2">Age Range</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Minimum Age: {value[0]} years
          </Label>
          <Slider
            value={[value[0]]}
            min={18}
            max={60}
            step={1}
            onValueChange={handleMinAgeChange}
            className="my-4"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Maximum Age: {value[1]} years
          </Label>
          <Slider
            value={[value[1]]}
            min={18}
            max={60}
            step={1}
            onValueChange={handleMaxAgeChange}
            className="my-4"
          />
        </div>
      </div>
    </div>
  );
}
