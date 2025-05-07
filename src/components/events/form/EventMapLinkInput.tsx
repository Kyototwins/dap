
import { Input } from "@/components/ui/input";
import { Link2 } from "lucide-react";
import { FormSectionTitle } from "./FormSectionTitle";

interface EventMapLinkInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function EventMapLinkInput({ value, onChange }: EventMapLinkInputProps) {
  return (
    <div className="space-y-2">
      <FormSectionTitle optional>Map Link</FormSectionTitle>
      <div className="relative">
        <Input
          id="map_link"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-gray-300 rounded-md focus-visible:ring-gray-500 pl-9"
          placeholder="https://maps.google.com/..."
        />
        <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        You can add a Google Maps or any other map service link (optional).
      </p>
    </div>
  );
}
