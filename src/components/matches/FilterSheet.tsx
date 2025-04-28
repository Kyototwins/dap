
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetTrigger
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { FilterState } from "@/types/matches";
import { SortOptions } from "./filter-components/SortOptions";
import { AgeRangeSelector } from "./filter-components/AgeRangeSelector";
import { LanguageSelector } from "./filter-components/LanguageSelector";
import { HobbySelector } from "./filter-components/HobbySelector";
import { CountrySelector } from "./filter-components/CountrySelector";

interface FilterSheetProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function FilterSheet({ filters, setFilters, isOpen, setIsOpen }: FilterSheetProps) {
  // Calculate number of active filters
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.speakingLanguages.length > 0) count++;
    if (filters.learningLanguages.length > 0) count++;
    if (filters.hobbies.length > 0) count++;
    if (filters.countries.length > 0) count++;
    if (filters.ageRange[0] > 18 || filters.ageRange[1] < 50) count++;
    if (filters.minLanguageLevel > 1) count++;
    return count;
  };

  // Filter change handler
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  // Language selection toggle handler
  const toggleLanguage = (list: keyof FilterState, lang: string) => {
    const currentList = [...filters[list] as string[]];
    const index = currentList.indexOf(lang);
    
    if (index >= 0) {
      currentList.splice(index, 1);
    } else {
      currentList.push(lang);
    }
    
    handleFilterChange(list, currentList);
  };

  // Reset filter handler
  const handleResetFilter = () => {
    setFilters({
      ageRange: [18, 50],
      speakingLanguages: [],
      learningLanguages: [],
      minLanguageLevel: 1,
      hobbies: [],
      countries: [],
      sortOption: "recent"
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/70 backdrop-blur-sm border-doshisha-softPurple flex gap-2 items-center"
        >
          <SlidersHorizontal className="h-4 w-4 text-doshisha-purple" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-1 bg-doshisha-softPurple text-doshisha-darkPurple">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Settings</SheetTitle>
          <SheetDescription>
            Please set your matching criteria
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <SortOptions 
            value={filters.sortOption}
            onChange={(value) => handleFilterChange("sortOption", value)}
          />
          
          <AgeRangeSelector 
            value={filters.ageRange}
            onChange={(value) => handleFilterChange("ageRange", value)}
          />
          
          <LanguageSelector 
            title="Speaking Languages"
            selectedLanguages={filters.speakingLanguages}
            onToggleLanguage={(lang) => toggleLanguage("speakingLanguages", lang)}
          />
          
          <LanguageSelector 
            title="Languages I'm Learning"
            selectedLanguages={filters.learningLanguages}
            onToggleLanguage={(lang) => toggleLanguage("learningLanguages", lang)}
          />
          
          <HobbySelector 
            selectedHobbies={filters.hobbies}
            onToggleHobby={(hobby) => {
              const currentHobbies = [...filters.hobbies];
              const index = currentHobbies.indexOf(hobby);
              
              if (index >= 0) {
                currentHobbies.splice(index, 1);
              } else {
                currentHobbies.push(hobby);
              }
              
              handleFilterChange("hobbies", currentHobbies);
            }}
          />
          
          <CountrySelector 
            selectedCountries={filters.countries}
            onToggleCountry={(country) => {
              const currentCountries = [...filters.countries];
              const index = currentCountries.indexOf(country);
              
              if (index >= 0) {
                currentCountries.splice(index, 1);
              } else {
                currentCountries.push(country);
              }
              
              handleFilterChange("countries", currentCountries);
            }}
          />
        </div>
        
        <SheetFooter className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleResetFilter}
            className="flex-1"
          >
            Reset
          </Button>
          <Button 
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-doshisha-purple hover:bg-doshisha-darkPurple"
          >
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

