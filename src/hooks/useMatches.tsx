
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
