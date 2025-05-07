
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormSectionTitle } from "./FormSectionTitle";

interface EventParticipantsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function EventParticipantsInput({ value, onChange }: EventParticipantsInputProps) {
  const [unlimitedParticipants, setUnlimitedParticipants] = useState(value === "0");
  
  const handleChange = (checked: boolean) => {
    setUnlimitedParticipants(checked);
    if (checked) {
      onChange("0");
    } else {
      onChange("");
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="unlimited" 
          checked={unlimitedParticipants} 
          onCheckedChange={(checked) => handleChange(!!checked)}
        />
        <label
          htmlFor="unlimited"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Unlimited participants
        </label>
      </div>
      
      {!unlimitedParticipants && (
        <div className="space-y-2">
          <FormSectionTitle htmlFor="max_participants">Maximum Participants</FormSectionTitle>
          <Input
            id="max_participants"
            type="number"
            min="1"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border-gray-300 rounded-md focus-visible:ring-gray-500"
            required
          />
        </div>
      )}
    </div>
  );
}
