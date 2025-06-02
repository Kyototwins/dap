import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define a subset of countries for the filter 
// (keeping the most common ones to avoid overwhelming the filter UI)
// Updated to match the actual origin values in the database
const FILTER_COUNTRY_OPTIONS = [
  { value: "Japan", label: "Japan" },
  { value: "USA", label: "USA" },
  { value: "China", label: "China" },
  { value: "Korea", label: "Korea" },
  { value: "UK", label: "UK" },
  { value: "Australia", label: "Australia" },
  { value: "Canada", label: "Canada" },
  { value: "France", label: "France" },
  { value: "Germany", label: "Germany" },
  { value: "India", label: "India" },
  { value: "Other", label: "Other" },
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
      <ScrollArea className="h-[200px] pr-4">
        <div className="grid grid-cols-2 gap-2">
          {FILTER_COUNTRY_OPTIONS.map(country => (
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
      </ScrollArea>
    </div>
  );
}
