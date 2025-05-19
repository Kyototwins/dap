import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/messages';
import { FilterState } from '@/types/matches';

export const useProfileFilter = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [visibleProfiles, setVisibleProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Updated filters structure to match FilterState interface
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [18, 50],
    speakingLanguages: [],
    learningLanguages: [],
    minLanguageLevel: 1,
    hobbies: [],
    countries: [],
    sortOption: 'recent'
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };

    getCurrentUser();
    loadProfiles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, profiles, searchQuery]);

  const loadProfiles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id;

    try {
      let { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', currentUserId || '');
      
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        // Process the profiles to ensure they conform to the Profile type
        // Especially handle language_levels which might be stored as JSON string
        const processedProfiles = data.map(profile => {
          // Parse language_levels if it's a string
          let processedLanguageLevels = profile.language_levels;
          if (typeof profile.language_levels === 'string') {
            try {
              processedLanguageLevels = JSON.parse(profile.language_levels);
            } catch (e) {
              console.error("Error parsing language levels:", e);
              // Keep it as is if parsing fails
            }
          }
          
          return {
            ...profile,
            language_levels: processedLanguageLevels,
            // Ensure fcm_token exists to satisfy TypeScript
            fcm_token: profile.fcm_token ?? null
          } as Profile;
        });

        setProfiles(processedProfiles);
        setFilteredProfiles(processedProfiles);
        setVisibleProfiles(processedProfiles.slice(0, 10)); // Initial visible profiles
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...profiles];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(profile => {
        const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.toLowerCase();
        const hasName = fullName.includes(query);
        const hasLanguage = profile.languages?.some(lang => lang.toLowerCase().includes(query)) || false;
        const hasHobby = profile.hobbies?.some(hobby => hobby.toLowerCase().includes(query)) || false;
        return hasName || hasLanguage || hasHobby;
      });
    }

    // Apply filter by age range
    result = result.filter(profile => 
      profile.age !== null &&
      profile.age >= filters.ageRange[0] && 
      profile.age <= filters.ageRange[1]
    );

    // Apply filter by speaking languages
    if (filters.speakingLanguages.length > 0) {
      result = result.filter(profile => 
        profile.languages && 
        filters.speakingLanguages.some(lang => profile.languages?.includes(lang))
      );
    }

    // Apply filter by learning languages
    if (filters.learningLanguages.length > 0) {
      result = result.filter(profile => 
        profile.learning_languages && 
        filters.learningLanguages.some(lang => profile.learning_languages?.includes(lang))
      );
    }

    // Apply filter by hobbies
    if (filters.hobbies.length > 0) {
      result = result.filter(profile => 
        profile.hobbies && 
        filters.hobbies.some(hobby => profile.hobbies?.includes(hobby))
      );
    }

    // Apply filter by countries
    if (filters.countries.length > 0) {
      result = result.filter(profile => 
        profile.origin && 
        filters.countries.includes(profile.origin)
      );
    }

    setFilteredProfiles(result);
    setVisibleProfiles(result.slice(0, 10)); // Reset visible profiles on filter change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleProfiles(prev => [
        ...prev, 
        ...filteredProfiles.slice(prev.length, prev.length + 10)
      ]);
      setLoadingMore(false);
    }, 500);
  };

  const handleRefresh = () => {
    setLoading(true);
    loadProfiles();
  };

  return {
    profiles, // Keep for backward compatibility
    filteredProfiles,
    visibleProfiles,
    loading,
    loadingMore,
    filters,
    searchQuery,
    isFilterSheetOpen,
    setFilters,
    setIsFilterSheetOpen,
    handleSearchChange,
    handleLoadMore,
    handleRefresh,
    updateFilter: (filterName: string, value: string | string[]) => {
      setFilters(prev => ({
        ...prev,
        [filterName]: value
      }));
    },
    resetFilters: () => {
      setFilters({
        ageRange: [18, 50],
        speakingLanguages: [],
        learningLanguages: [],
        minLanguageLevel: 1,
        hobbies: [],
        countries: [],
        sortOption: 'recent'
      });
    },
    totalCount: profiles.length,
    filteredCount: filteredProfiles.length
  };
};
