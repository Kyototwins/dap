import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/messages';

export const useProfileFilter = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    gender: '',
    minAge: '',
    maxAge: '',
    origin: '',
    university: '',
    department: '',
    languages: [] as string[],
    hobbies: [] as string[],
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
  }, [filters, profiles]);

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
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...profiles];

    // Filter by gender
    if (filters.gender) {
      result = result.filter(profile => profile.gender === filters.gender);
    }

    // Filter by age range
    if (filters.minAge) {
      const minAge = parseInt(filters.minAge);
      result = result.filter(profile => profile.age !== null && profile.age >= minAge);
    }

    if (filters.maxAge) {
      const maxAge = parseInt(filters.maxAge);
      result = result.filter(profile => profile.age !== null && profile.age <= maxAge);
    }

    // Filter by origin
    if (filters.origin) {
      result = result.filter(profile => profile.origin === filters.origin);
    }

    // Filter by university
    if (filters.university) {
      result = result.filter(profile => profile.university === filters.university);
    }

    // Filter by department
    if (filters.department) {
      result = result.filter(profile => profile.department === filters.department);
    }

    // Filter by languages
    if (filters.languages.length > 0) {
      result = result.filter(profile => 
        profile.languages !== null && 
        filters.languages.every(lang => profile.languages!.includes(lang))
      );
    }

    // Filter by hobbies
    if (filters.hobbies.length > 0) {
      result = result.filter(profile => 
        profile.hobbies !== null && 
        filters.hobbies.some(hobby => profile.hobbies!.includes(hobby))
      );
    }

    setFilteredProfiles(result);
  };

  const updateFilter = (filterName: string, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      gender: '',
      minAge: '',
      maxAge: '',
      origin: '',
      university: '',
      department: '',
      languages: [],
      hobbies: [],
    });
  };

  return {
    profiles: filteredProfiles,
    loading,
    filters,
    updateFilter,
    resetFilters,
    totalCount: profiles.length,
    filteredCount: filteredProfiles.length
  };
};
