
import { Checkbox } from "@/components/ui/checkbox";

const COUNTRY_OPTIONS = [
  { value: "japan", label: "Japan" },
  { value: "usa", label: "USA" },
  { value: "china", label: "China" },
  { value: "korea", label: "Korea" },
  { value: "other", label: "Other" },
];

interface CountrySelectorProps {
  selectedCountries: string[];
  onToggleCountry: (country: string) => void;
}

export function CountrySelector({ 
  selectedCountries, 
  onToggleCountry 
}: CountrySelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium border-b pb-2">Country of Origin</h3>
      <div className="grid grid-cols-2 gap-2">
        {COUNTRY_OPTIONS.map(country => (
          <div key={country.value} className="flex items-center space-x-2">
            <Checkbox 
              id={country.value} 
              checked={selectedCountries.includes(country.value)}
              onCheckedChange={() => onToggleCountry(country.value)}
            />
            <label
              htmlFor={country.value}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {country.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

