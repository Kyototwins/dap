
import { Slider } from "@/components/ui/slider";

interface AgeRangeSelectorProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function AgeRangeSelector({ value, onChange }: AgeRangeSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium border-b pb-2">Age Range</h3>
      <div className="space-y-4">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{value[0]} years</span>
          <span>{value[1]} years</span>
        </div>
        <Slider
          value={value}
          min={18}
          max={60}
          step={1}
          onValueChange={(value) => onChange(value as [number, number])}
          className="my-4"
        />
      </div>
    </div>
  );
}

