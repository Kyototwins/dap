
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/messages";
import type { FilterState } from "@/types/matches";

// プロフィール完了率を計算する関数
const calculateProfileCompletion = (profile: Profile): number => {
  const fields = [
    'first_name', 'last_name', 'age', 'gender', 'origin', 'university',
    'department', 'about_me', 'avatar_url', 'languages'
  ];

  const completedFields = fields.filter(field => {
    if (Array.isArray(profile[field as keyof Profile])) {
      return (profile[field as keyof Profile] as any[]).length > 0;
    }
    return profile[field as keyof Profile] !== null && profile[field as keyof Profile] !== '';
  });

  return Math.round((completedFields.length / fields.length) * 100);
};

export function useProfileFilter() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [visibleProfiles, setVisibleProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [currentUserOrigin, setCurrentUserOrigin] = useState<string | null>(null);
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

      // Get current user's origin
      const { data: currentUserProfile } = await supabase
        .from("profiles")
        .select("origin")
        .eq("id", user.id)
        .single();

      if (currentUserProfile) {
        setCurrentUserOrigin(currentUserProfile.origin);
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id);

      if (error) throw error;
      
      // Map the data to match the Profile type with all required fields
      const typedProfiles = data?.map(profile => ({
        id: profile.id,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        avatar_url: profile.avatar_url || null,
        about_me: profile.about_me || null,
        age: profile.age || null,
        gender: profile.gender || null,
        university: profile.university || null,
        department: profile.department || '',
        year: profile.year || '',
        hobbies: profile.hobbies || [],
        languages: profile.languages || [],
        language_levels: profile.language_levels as Record<string, number>,
        superpower: profile.superpower || '',
        learning_languages: profile.learning_languages || [],
        origin: profile.origin || null,
        sexuality: profile.sexuality || null,
        ideal_date: profile.ideal_date || null,
        life_goal: profile.life_goal || null,
        image_url_1: profile.image_url_1 || null,
        image_url_2: profile.image_url_2 || null,
        created_at: profile.created_at || '',
        photo_comment: profile.photo_comment || null,
        worst_nightmare: profile.worst_nightmare || null,
        friend_activity: profile.friend_activity || null,
        best_quality: profile.best_quality || null,
        hobby_photo_url: null,
        pet_photo_url: null,
        hobby_photo_comment: null,
        pet_photo_comment: null
      })) || [];
      
      // プロフィール完了率が30%以下のユーザーを除外
      const filteredByCompletion = typedProfiles.filter(profile => {
        const completion = calculateProfileCompletion(profile);
        return completion > 30;
      });
      
      setProfiles(filteredByCompletion);
      applyFilters(filteredByCompletion, searchQuery, filters);
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

    // Origin-based prioritization and sorting
    if (filterState.sortOption === "recent") {
      result.sort((a, b) => {
        // First prioritize by origin difference
        const aIsDifferentOrigin = currentUserOrigin === 'Japan' 
          ? a.origin !== 'Japan' 
          : a.origin === 'Japan';
        const bIsDifferentOrigin = currentUserOrigin === 'Japan' 
          ? b.origin !== 'Japan' 
          : b.origin === 'Japan';
        
        if (aIsDifferentOrigin && !bIsDifferentOrigin) return -1;
        if (!aIsDifferentOrigin && bIsDifferentOrigin) return 1;
        
        // Then sort by created_at
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    } else if (filterState.sortOption === "active") {
      result.sort((a, b) => {
        // First prioritize by origin difference
        const aIsDifferentOrigin = currentUserOrigin === 'Japan' 
          ? a.origin !== 'Japan' 
          : a.origin === 'Japan';
        const bIsDifferentOrigin = currentUserOrigin === 'Japan' 
          ? b.origin !== 'Japan' 
          : b.origin === 'Japan';
        
        if (aIsDifferentOrigin && !bIsDifferentOrigin) return -1;
        if (!aIsDifferentOrigin && bIsDifferentOrigin) return 1;
        
        // Then sort by name
        const nameA = `${a.first_name || ''} ${a.last_name || ''}`;
        const nameB = `${b.first_name || ''} ${b.last_name || ''}`;
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
  }, [searchQuery, filters, currentUserOrigin]);

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
