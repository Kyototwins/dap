
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SORT_OPTIONS = [
  { value: "recent", label: "Newest Registered" },
  { value: "active", label: "Most Active" },
];

interface SortOptionsProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortOptions({ value, onChange }: SortOptionsProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium border-b pb-2">Sort Order</h3>
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
        className="space-y-1"
      >
        {SORT_OPTIONS.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <label htmlFor={option.value} className="text-sm">{option.label}</label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

