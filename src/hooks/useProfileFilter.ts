
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

// ランダムに配列をシャッフルする関数
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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
  
  // Filter states - default to random sorting
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [18, 50],
    speakingLanguages: [],
    learningLanguages: [],
    minLanguageLevel: 1,
    hobbies: [],
    countries: [],
    sortOption: "random"
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

      console.log("Current user profile:", currentUserProfile);
      
      if (currentUserProfile) {
        setCurrentUserOrigin(currentUserProfile.origin);
        console.log("Current user origin set to:", currentUserProfile.origin);
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
      
      console.log("Total profiles fetched:", typedProfiles.length);
      console.log("Sample profile origins:", typedProfiles.slice(0, 5).map(p => ({ name: p.first_name, origin: p.origin })));
      
      // プロフィール完了率が30%以下のユーザーを除外
      const filteredByCompletion = typedProfiles.filter(profile => {
        const completion = calculateProfileCompletion(profile);
        return completion > 30;
      });
      
      console.log("Profiles after completion filter:", filteredByCompletion.length);
      
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

    // Origin-based prioritization and sorting
    const isCurrentUserJapanese = currentUserOrigin?.toLowerCase() === 'japan';
    
    // Separate profiles by origin priority
    const priorityProfiles = result.filter(profile => {
      return isCurrentUserJapanese 
        ? profile.origin?.toLowerCase() !== 'japan' 
        : profile.origin?.toLowerCase() === 'japan';
    });
    
    const otherProfiles = result.filter(profile => {
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
    result = [...sortedPriorityProfiles, ...sortedOtherProfiles];

    console.log("Final sorted profiles (first 5):", result.slice(0, 5).map(p => ({ 
      name: p.first_name, 
      origin: p.origin,
      isPriority: isCurrentUserJapanese ? p.origin?.toLowerCase() !== 'japan' : p.origin?.toLowerCase() === 'japan',
      sortType: filterState.sortOption
    })));

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
