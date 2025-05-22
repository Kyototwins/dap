
import { useState } from "react";
import type { Profile } from "@/types/messages";
import type { FilterState } from "@/types/matches";

export function useProfileFiltering() {
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  
  // Apply search and filters
  const applyFilters = (data: Profile[], query: string, filterState: FilterState) => {
    let result = [...data];

    // Filter by search query
    if (query) {
      const searchLower = query.toLowerCase();
      result = result.filter((profile) => {
        return (
          profile.first_name?.toLowerCase().includes(searchLower) ||
          profile.last_name?.toLowerCase().includes(searchLower) ||
          profile.about_me?.toLowerCase().includes(searchLower) ||
          profile.university?.toLowerCase().includes(searchLower) ||
          profile.department?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Age filtering
    result = result.filter(profile => {
      if (!profile.age) return true;
      return profile.age >= filterState.ageRange[0] && profile.age <= filterState.ageRange[1];
    });

    // Origin filtering
    if (filterState.countries.length > 0) {
      result = result.filter(profile => 
        !profile.origin || filterState.countries.includes(profile.origin)
      );
    }

    // Speaking languages filtering
    if (filterState.speakingLanguages.length > 0) {
      result = result.filter(profile => {
        if (!profile.languages || profile.languages.length === 0) return false;
        
        return filterState.speakingLanguages.some(lang => {
          const hasLanguage = profile.languages?.includes(lang);
          if (!hasLanguage) return false;
          
          if (profile.language_levels && typeof profile.language_levels === 'object') {
            const level = profile.language_levels[lang];
            return level >= filterState.minLanguageLevel;
          }
          return true;
        });
      });
    }

    // Learning languages filtering
    if (filterState.learningLanguages.length > 0) {
      result = result.filter(profile => {
        if (!profile.learning_languages || profile.learning_languages.length === 0) return false;
        return filterState.learningLanguages.some(lang => 
          profile.learning_languages?.includes(lang)
        );
      });
    }

    // Hobbies filtering
    if (filterState.hobbies.length > 0) {
      result = result.filter(profile => {
        if (!profile.hobbies || profile.hobbies.length === 0) return false;
        return filterState.hobbies.some(hobby => 
          profile.hobbies?.includes(hobby)
        );
      });
    }

    // Sorting
    if (filterState.sortOption === "recent") {
      result.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    } else if (filterState.sortOption === "active") {
      result.sort((a, b) => {
        const nameA = `${a.first_name || ''} ${a.last_name || ''}`;
        const nameB = `${b.first_name || ''} ${b.last_name || ''}`;
        return nameA.localeCompare(nameB);
      });
    }

    return result;
  };

  return {
    filteredProfiles,
    setFilteredProfiles,
    applyFilters
  };
}
