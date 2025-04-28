import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

// Constants
const LANGUAGE_OPTIONS = [
  { value: "japanese", label: "Japanese" },
  { value: "english", label: "English" },
  { value: "chinese", label: "Chinese" },
  { value: "korean", label: "Korean" },
  { value: "french", label: "French" },
  { value: "spanish", label: "Spanish" },
];

// Country options
const COUNTRY_OPTIONS = [
  { value: "japan", label: "Japan" },
  { value: "usa", label: "USA" },
  { value: "china", label: "China" },
  { value: "korea", label: "Korea" },
  { value: "other", label: "Other" },
];

// Hobby options
const HOBBY_OPTIONS = [
  "Traveling", "Cooking", "Watching Movies", "Reading", "Music", "Sports", "Art", 
  "Photography", "Dancing", "Gaming", "Programming", "Languages"
];

// Sort options
const SORT_OPTIONS = [
  { value: "recent", label: "Newest Registered" },
  { value: "active", label: "Most Active" },
];

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

  // Hobby selection toggle handler
  const toggleHobby = (hobby: string) => {
    const currentHobbies = [...filters.hobbies];
    const index = currentHobbies.indexOf(hobby);
    
    if (index >= 0) {
      currentHobbies.splice(index, 1);
    } else {
      currentHobbies.push(hobby);
    }
    
    handleFilterChange("hobbies", currentHobbies);
  };

  // Country toggle handler
  const toggleCountry = (country: string) => {
    const currentCountries = [...filters.countries];
    const index = currentCountries.indexOf(country);
    
    if (index >= 0) {
      currentCountries.splice(index, 1);
    } else {
      currentCountries.push(country);
    }
    
    handleFilterChange("countries", currentCountries);
  };

  // Save filter handler
  const handleSaveFilter = () => {
    setIsOpen(false);
    // Filters are already applied, no extra action needed
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
          {/* Sort Settings */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium border-b pb-2">Sort Order</h3>
            <RadioGroup 
              value={filters.sortOption} 
              onValueChange={(value) => handleFilterChange("sortOption", value)}
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
          
          {/* Age Range */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium border-b pb-2">Age Range</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{filters.ageRange[0]} years</span>
                <span>{filters.ageRange[1]} years</span>
              </div>
              <Slider
                value={filters.ageRange}
                min={18}
                max={60}
                step={1}
                onValueChange={(value) => handleFilterChange("ageRange", value as [number, number])}
                className="my-4"
              />
            </div>
          </div>
          
          {/* Language Filters */}
          
          {/* Speaking Languages */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Speaking Languages</h4>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map(lang => (
                <Badge
                  key={lang.value}
                  variant={filters.speakingLanguages.includes(lang.label) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    filters.speakingLanguages.includes(lang.label) 
                      ? "bg-[#7f1184] text-white hover:bg-[#671073]" 
                      : "bg-white text-[#7f1184] hover:bg-[#f3e8ff]"
                  }`}
                  onClick={() => toggleLanguage("speakingLanguages", lang.label)}
                >
                  {lang.label}
                </Badge>
              ))}
            </div>
          </div>
            
          {/* Learning Languages */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Languages I'm Learning</h4>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map(lang => (
                <Badge
                  key={lang.value}
                  variant={filters.learningLanguages.includes(lang.label) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    filters.learningLanguages.includes(lang.label) 
                      ? "bg-[#7f1184] text-white hover:bg-[#671073]" 
                      : "bg-white text-[#7f1184] hover:bg-[#f3e8ff]"
                  }`}
                  onClick={() => toggleLanguage("learningLanguages", lang.label)}
                >
                  {lang.label}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Hobbies / Interests */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium border-b pb-2">Hobbies & Interests</h3>
            <div className="flex flex-wrap gap-2">
              {HOBBY_OPTIONS.map(hobby => (
                <Badge
                  key={hobby}
                  variant={filters.hobbies.includes(hobby) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    filters.hobbies.includes(hobby) 
                      ? "bg-[#7f1184] text-white hover:bg-[#671073]" 
                      : "bg-white text-[#7f1184] hover:bg-[#f3e8ff]"
                  }`}
                  onClick={() => toggleHobby(hobby)}
                >
                  {hobby}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Countries of Origin */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium border-b pb-2">Country of Origin</h3>
            <div className="grid grid-cols-2 gap-2">
              {COUNTRY_OPTIONS.map(country => (
                <div key={country.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={country.value} 
                    checked={filters.countries.includes(country.value)}
                    onCheckedChange={() => toggleCountry(country.value)}
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
            onClick={handleSaveFilter}
            className="flex-1 bg-doshisha-purple hover:bg-doshisha-darkPurple"
          >
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
