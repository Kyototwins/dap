
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

  // 新規LIKEしたユーザーIDを保持
  const prevLikeIdsRef = useState<string[]>([]);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: pendingMatches, error: matchError } = await supabase
        .from("matches")
        .select(`
          id,
          user1_id,
          user2_id,
          status,
          user1:profiles!matches_user1_id_fkey (
            id, first_name, last_name, avatar_url, about_me, age, gender, university, 
            department, year, hobbies, languages, language_levels, superpower, 
            learning_languages, origin, sexuality, ideal_date, life_goal, 
            image_url_1, image_url_2, created_at, photo_comment, worst_nightmare, 
            friend_activity, best_quality
          )
        `)
        .eq("user2_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (matchError) throw matchError;

      if (pendingMatches && pendingMatches.length > 0) {
        const profiles = pendingMatches.map(match => {
          const profile = match.user1;

          let processedLanguageLevels: Record<string, number> = {};
          if (profile.language_levels) {
            if (typeof profile.language_levels === 'string') {
              try {
                processedLanguageLevels = JSON.parse(profile.language_levels);
              } catch (e) {
                console.error("Error parsing language_levels:", e);
              }
            } else if (typeof profile.language_levels === 'object') {
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

        // 新規LIKE検知し通知追加（初回はスキップ）
        const prevIds = prevLikeIdsRef[0];
        const currIds = profiles.map(x => x.id);
        const newLikeIds = currIds.filter((id) => !prevIds.includes(id));
        if (prevIds.length > 0 && newLikeIds.length > 0) {
          // 通知を追加
          for (const id of newLikeIds) {
            const newProfile = profiles.find(x => x.id === id);
            if (newProfile) {
              await supabase.from("notifications").insert([{
                user_id: user.id,
                type: "new_match",
                content: `${newProfile.first_name}さんがあなたと友達になりたがっています！`,
                related_id: newProfile.id // 相手のプロフィールIDへジャンプ用
              }]);
            }
          }
        }
        prevLikeIdsRef[1](currIds);

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
