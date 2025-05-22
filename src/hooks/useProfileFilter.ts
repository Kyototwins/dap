
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/messages";
import type { FilterState } from "@/types/matches";

export function useProfileFilter() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [visibleProfiles, setVisibleProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const pageSize = 10;
  const pageRef = useRef(1);
  const { toast } = useToast();
  
  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [18, 50],
    speakingLanguages: [],
    learningLanguages: [],
    minLanguageLevel: 1,
    hobbies: [],
    countries: [],
    sortOption: "recent"
  });

  // Fetch profile data
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id);

      if (error) throw error;
      
      // Map the data to match the Profile type with all required fields
      const typedProfiles = data?.map(profile => {
        // Check if notification_time exists in profile data (TypeScript doesn't know this exists)
        const dbProfile = profile as any;
        
        return {
          id: dbProfile.id,
          created_at: dbProfile.created_at || '',
          first_name: dbProfile.first_name || null,
          last_name: dbProfile.last_name || null,
          email_digest_enabled: dbProfile.email_digest_enabled || null,
          notification_email: dbProfile.notification_email || null,
          notification_time: dbProfile.notification_time || null,
          fcm_token: dbProfile.fcm_token || null,
          avatar_url: dbProfile.avatar_url || null,
          about_me: dbProfile.about_me || null,
          age: dbProfile.age || null,
          gender: dbProfile.gender || null,
          origin: dbProfile.origin || null,
          sexuality: dbProfile.sexuality || null,
          university: dbProfile.university || null,
          department: dbProfile.department || null,
          year: dbProfile.year || null,
          image_url_1: dbProfile.image_url_1 || null,
          image_url_2: dbProfile.image_url_2 || null,
          hobbies: dbProfile.hobbies || null,
          languages: dbProfile.languages || null,
          language_levels: dbProfile.language_levels as Record<string, number> | null,
          learning_languages: dbProfile.learning_languages || null,
          ideal_date: dbProfile.ideal_date || null,
          life_goal: dbProfile.life_goal || null,
          superpower: dbProfile.superpower || null,
          photo_comment: dbProfile.photo_comment || null,
          hobby_photo_url: dbProfile.hobby_photo_url || null,
          hobby_photo_comment: dbProfile.hobby_photo_comment || null,
          pet_photo_url: dbProfile.pet_photo_url || null,
          pet_photo_comment: dbProfile.pet_photo_comment || null,
          worst_nightmare: dbProfile.worst_nightmare || null,
          friend_activity: dbProfile.friend_activity || null,
          best_quality: dbProfile.best_quality || null
        } as Profile;
      }) as Profile[];
      
      setProfiles(typedProfiles);
      applyFilters(typedProfiles, searchQuery, filters);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
        const nameB = `${b.first_name || ''} ${a.last_name || ''}`;
        return nameA.localeCompare(nameB);
      });
    }

    setFilteredProfiles(result);
    pageRef.current = 1;
    setVisibleProfiles(result.slice(0, pageSize));
  };

  // Initial load
  useEffect(() => {
    fetchProfiles();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (profiles.length > 0) {
      applyFilters(profiles, searchQuery, filters);
    }
  }, [searchQuery, filters]);

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Load more handler
  const handleLoadMore = () => {
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    const start = (nextPage - 1) * pageSize;
    const end = nextPage * pageSize;
    
    setTimeout(() => {
      setVisibleProfiles(prev => [
        ...prev, 
        ...filteredProfiles.slice(start, end)
      ]);
      pageRef.current = nextPage;
      setLoadingMore(false);
    }, 500);
  };

  // Refresh data handler
  const handleRefresh = () => {
    fetchProfiles();
  };

  return {
    profiles,
    filteredProfiles,
    visibleProfiles,
    loading,
    loadingMore,
    searchQuery,
    filters,
    isFilterSheetOpen,
    setFilters,
    setIsFilterSheetOpen,
    handleSearchChange,
    handleLoadMore,
    handleRefresh,
  };
}
