
import { FormSectionTitle } from "./FormSectionTitle";
import { Input } from "@/components/ui/input";

interface EventParticipationFormInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function EventParticipationFormInput({ value, onChange }: EventParticipationFormInputProps) {
  return (
    <div className="space-y-2">
      <FormSectionTitle htmlFor="participation_form">
        Participation Form (Optional)
      </FormSectionTitle>
      <Input
        id="participation_form"
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://forms.google.com/..."
        className="border-gray-300 rounded-md focus-visible:ring-gray-500"
      />
      <p className="text-sm text-gray-600">
        Add a Google Form or other form link for participants to fill out
      </p>
    </div>
  );
}
