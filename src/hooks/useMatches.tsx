
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Match } from "@/types/messages";

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      const { data: matchesData, error } = await supabase
        .from("matches")
        .select(`
          *,
          user1:profiles!matches_user1_id_fkey (id, first_name, last_name, avatar_url, about_me, age, gender, ideal_date, image_url_1, image_url_2, life_goal, origin, sexuality, superpower, university, created_at),
          user2:profiles!matches_user2_id_fkey (id, first_name, last_name, avatar_url, about_me, age, gender, ideal_date, image_url_1, image_url_2, life_goal, origin, sexuality, superpower, university, created_at),
          messages (content, created_at)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const processedMatches = matchesData.map((match) => {
        const otherUser = match.user1_id === user.id ? match.user2 : match.user1;
        
        return {
          ...match,
          otherUser: {
            ...otherUser,
            department: '',
            year: '',
            hobbies: [],
            languages: [],
            language_levels: {},
            superpower: otherUser.superpower || '',
            learning_languages: [],
          },
          lastMessage: match.messages[0],
        };
      });

      setMatches(processedMatches);
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return {
    matches,
    loading,
    fetchMatches
  };
}
