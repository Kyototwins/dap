
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/messages";

export function useLikesReceived() {
  const [likedProfiles, setLikedProfiles] = useState<Profile[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [loadingMoreLikes, setLoadingMoreLikes] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      // Get all pending match requests where current user is user2_id
      const { data: pendingMatches, error: matchError } = await supabase
        .from("matches")
        .select(`
          user1_id,
          user1:profiles!matches_user1_id_fkey (id, first_name, last_name, avatar_url, about_me, age, gender, university, department, year, hobbies, languages, language_levels, superpower, learning_languages, origin, sexuality, ideal_date, life_goal, image_url_1, image_url_2, created_at, photo_comment, worst_nightmare, friend_activity, best_quality)
        `)
        .eq("user2_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      
      if (matchError) throw matchError;
      
      if (pendingMatches && pendingMatches.length > 0) {
        // Transform the data to avoid deep type instantiation issues
        const profiles = pendingMatches.map(match => {
          const profile = match.user1;
          
          // Process language_levels to ensure it's the correct type
          let processedLanguageLevels: Record<string, number> = {};
          if (profile.language_levels) {
            // If it's a string, try to parse it
            if (typeof profile.language_levels === 'string') {
              try {
                processedLanguageLevels = JSON.parse(profile.language_levels);
              } catch (e) {
                console.error("Error parsing language_levels:", e);
              }
            } 
            // If it's already an object, safely convert it to Record<string, number>
            else if (typeof profile.language_levels === 'object') {
              Object.entries(profile.language_levels).forEach(([key, value]) => {
                if (typeof value === 'number') {
                  processedLanguageLevels[key] = value;
                } else if (typeof value === 'string' && !isNaN(Number(value))) {
                  processedLanguageLevels[key] = Number(value);
                }
              });
            }
          }
          
          return {
            ...profile,
            language_levels: processedLanguageLevels,
            hobbies: profile.hobbies || [],
            languages: profile.languages || [],
            learning_languages: profile.learning_languages || []
          } as Profile;
        });
        
        setLikedProfiles(profiles);
      } else {
        setLikedProfiles([]);
      }
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

  const loadMoreLikes = () => {
    if (loadingMoreLikes || visibleCount >= likedProfiles.length) return;
    
    setLoadingMoreLikes(true);
    // Simulate loading more items
    setTimeout(() => {
      setVisibleCount(prev => prev + 10);
      setLoadingMoreLikes(false);
    }, 500);
  };

  const refreshLikes = () => {
    fetchLikes();
  };

  return {
    likedProfiles,
    loading,
    loadMoreLikes,
    loadingMoreLikes,
    refreshLikes
  };
}
