
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormSectionTitle } from "./FormSectionTitle";

interface EventCategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function EventCategorySelect({ value, onChange }: EventCategorySelectProps) {
  const categories = [
    "Sports",
    "Study",
    "Meal",
    "Karaoke",
    "Sightseeing",
    "Other",
  ];

  return (
    <div className="space-y-2">
      <FormSectionTitle htmlFor="category">Category</FormSectionTitle>
      <Select
        value={value}
        onValueChange={onChange}
        required
      >
        <SelectTrigger className="border-gray-300 rounded-md focus-visible:ring-gray-500">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
