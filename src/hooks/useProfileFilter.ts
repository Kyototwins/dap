
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/messages";
import { FilterState } from "@/types/matches";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

export function useProfileFilter() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [visibleProfiles, setVisibleProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const initialLoadDone = useRef(false);
  const { online } = useConnectionStatus();

  // Default filter state
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [18, 50],
    speakingLanguages: [],
    learningLanguages: [],
    minLanguageLevel: 1,
    hobbies: [],
    countries: [],
    sortOption: "recent"
  });

  // Fetch profiles on component mount
  useEffect(() => {
    if (!online || initialLoadDone.current) return;
    
    fetchProfiles();
  }, [online]);

  // Fetch profiles from Supabase
  const fetchProfiles = async () => {
    try {
      console.log("Fetching profiles...");
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("User not authenticated");
        setLoading(false);
        return;
      }

      // Fetch all profiles except current user's
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id);

      if (error) {
        console.error("Error fetching profiles:", error);
        setLoading(false);
        return;
      }

      console.log(`Fetched ${data?.length || 0} profiles`);
      
      // Process profiles to ensure they have all required properties
      const validProfiles = (data || []).map(profile => {
        return {
          id: profile.id,
          firstName: profile.first_name || "Anonymous",
          lastName: profile.last_name || "",
          age: profile.age || 0,
          avatarUrl: profile.avatar_url || "",
          bio: profile.about_me || "",
          university: profile.university || "Unknown University",
          department: profile.department || "",
          year: profile.year || "",
          hobbies: profile.hobbies || [],
          languages: profile.languages || [],
          learningLanguages: profile.learning_languages || [],
          origin: profile.origin || "",
          photos: [
            profile.avatar_url,
            profile.image_url_1,
            profile.image_url_2
          ].filter(Boolean) as string[]
        };
      });

      // Update state
      setProfiles(validProfiles);
      setFilteredProfiles(validProfiles);
      setVisibleProfiles(validProfiles.slice(0, 10)); // Show first 10 profiles initially
      
      initialLoadDone.current = true;
    } catch (error) {
      console.error("Error in fetchProfiles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search and filter profiles based on user input
  useEffect(() => {
    if (profiles.length === 0) return;
    
    const filtered = profiles.filter(profile => {
      // Filter by search query
      const searchMatches = 
        searchQuery === "" || 
        `${profile.firstName} ${profile.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.languages || []).some(lang => 
          lang.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (profile.learningLanguages || []).some(lang => 
          lang.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (profile.hobbies || []).some(hobby => 
          hobby.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (profile.university || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.origin || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!searchMatches) return false;
      
      // Filter by age
      const ageMatches = profile.age >= filters.ageRange[0] && profile.age <= filters.ageRange[1];
      if (!ageMatches) return false;
      
      // Filter by speaking languages
      const speakingLanguagesMatch = filters.speakingLanguages.length === 0 || 
        filters.speakingLanguages.some(lang => 
          profile.languages?.includes(lang)
        );
      if (!speakingLanguagesMatch) return false;
      
      // Filter by learning languages
      const learningLanguagesMatch = filters.learningLanguages.length === 0 || 
        filters.learningLanguages.some(lang => 
          profile.learningLanguages?.includes(lang)
        );
      if (!learningLanguagesMatch) return false;
      
      // Filter by hobbies
      const hobbiesMatch = filters.hobbies.length === 0 || 
        filters.hobbies.some(hobby => 
          profile.hobbies?.includes(hobby)
        );
      if (!hobbiesMatch) return false;
      
      // Filter by countries
      const countriesMatch = filters.countries.length === 0 || 
        filters.countries.includes(profile.origin || "");
      if (!countriesMatch) return false;
      
      return true;
    });
    
    // Sort profiles based on selected option
    const sortedProfiles = [...filtered].sort((a, b) => {
      if (filters.sortOption === "recent") {
        return 0; // Default order (most recent first)
      } else if (filters.sortOption === "age_asc") {
        return (a.age || 0) - (b.age || 0);
      } else if (filters.sortOption === "age_desc") {
        return (b.age || 0) - (a.age || 0);
      } else if (filters.sortOption === "name_asc") {
        return a.firstName.localeCompare(b.firstName);
      }
      return 0;
    });
    
    setFilteredProfiles(sortedProfiles);
    setVisibleProfiles(sortedProfiles.slice(0, 10)); // Reset visible profiles to first 10
  }, [searchQuery, filters, profiles]);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Load more profiles
  const handleLoadMore = useCallback(() => {
    if (loadingMore || visibleProfiles.length >= filteredProfiles.length) return;
    
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleProfiles(prev => [
        ...prev,
        ...filteredProfiles.slice(prev.length, prev.length + 10)
      ]);
      setLoadingMore(false);
    }, 500); // Add slight delay for better UX
  }, [filteredProfiles, visibleProfiles, loadingMore]);

  // Refresh profiles
  const handleRefresh = useCallback(() => {
    fetchProfiles();
  }, []);

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
    handleRefresh
  };
}
