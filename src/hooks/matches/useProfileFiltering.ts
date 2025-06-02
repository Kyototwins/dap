
import type { Profile } from "@/types/messages";
import type { FilterState } from "@/types/matches";
import { shuffleArray } from "@/utils/profileUtils";

export function useProfileFiltering() {
  const applyFilters = (
    data: Profile[], 
    query: string, 
    filterState: FilterState, 
    currentUserOrigin: string | null
  ): Profile[] => {
    let result = [...data];

    console.log("Applying filters with current user origin:", currentUserOrigin);
    console.log("Total profiles before filtering:", result.length);

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

    console.log("Profiles after all filters:", result.length);

    return result;
  };

  const applySorting = (
    profiles: Profile[], 
    filterState: FilterState, 
    currentUserOrigin: string | null
  ): Profile[] => {
    // Origin-based prioritization and sorting
    const isCurrentUserJapanese = currentUserOrigin?.toLowerCase() === 'japan';
    
    // Separate profiles by origin priority
    const priorityProfiles = profiles.filter(profile => {
      return isCurrentUserJapanese 
        ? profile.origin?.toLowerCase() !== 'japan' 
        : profile.origin?.toLowerCase() === 'japan';
    });
    
    const otherProfiles = profiles.filter(profile => {
      return isCurrentUserJapanese 
        ? profile.origin?.toLowerCase() === 'japan'
        : profile.origin?.toLowerCase() !== 'japan';
    });
    
    console.log(`Priority profiles (different origin): ${priorityProfiles.length}`);
    console.log(`Other profiles (same origin): ${otherProfiles.length}`);
    
    // Apply sorting within each group
    let sortedPriorityProfiles: Profile[];
    let sortedOtherProfiles: Profile[];
    
    if (filterState.sortOption === "alphabetical") {
      sortedPriorityProfiles = [...priorityProfiles].sort((a, b) => {
        const nameA = `${a.first_name || ''} ${a.last_name || ''}`;
        const nameB = `${b.first_name || ''} ${b.last_name || ''}`;
        return nameA.localeCompare(nameB);
      });
      
      sortedOtherProfiles = [...otherProfiles].sort((a, b) => {
        const nameA = `${a.first_name || ''} ${a.last_name || ''}`;
        const nameB = `${b.first_name || ''} ${b.last_name || ''}`;
        return nameA.localeCompare(nameB);
      });
    } else {
      // Random sorting (default)
      sortedPriorityProfiles = shuffleArray(priorityProfiles);
      sortedOtherProfiles = shuffleArray(otherProfiles);
    }
    
    // Combine: priority profiles first, then others
    const result = [...sortedPriorityProfiles, ...sortedOtherProfiles];

    console.log("Final sorted profiles (first 5):", result.slice(0, 5).map(p => ({ 
      name: p.first_name, 
      origin: p.origin,
      isPriority: isCurrentUserJapanese ? p.origin?.toLowerCase() !== 'japan' : p.origin?.toLowerCase() === 'japan',
      sortType: filterState.sortOption
    })));

    return result;
  };

  return {
    applyFilters,
    applySorting
  };
}
