
import { useState, useEffect } from 'react';
import { Match } from '@/types/matches';
import { supabase } from '@/integrations/supabase/client';
import { getUserMatches, enhanceMatchWithUserProfile, type EnhancedMatch } from '@/services/matchService';

export function useMatches() {
  const [matches, setMatches] = useState<EnhancedMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const userMatches = await getUserMatches(user.id);
        
        // Enhance matches with user profiles
        const enhancedMatches = await Promise.all(
          userMatches.map(match => enhanceMatchWithUserProfile(match, user.id))
        );
        
        // Fetch the latest message for each match
        for (const match of enhancedMatches) {
          const { data: latestMessages } = await supabase
            .from("messages")
            .select("*")
            .eq("match_id", match.id)
            .order("created_at", { ascending: false })
            .limit(1);
          
          if (latestMessages && latestMessages.length > 0) {
            match.lastMessage = {
              id: latestMessages[0].id,
              content: latestMessages[0].content,
              created_at: latestMessages[0].created_at,
              sender_id: latestMessages[0].sender_id,
              match_id: match.id
            };
          }
        }
        
        console.log("Enhanced matches with latest messages:", enhancedMatches);
        setMatches(enhancedMatches);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rename refreshMatches to fetchMatches to fix useMessages error
  return { matches, loading, fetchMatches, refreshMatches: fetchMatches };
}
