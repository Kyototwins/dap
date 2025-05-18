
import { supabase } from '@/integrations/supabase/client';
import { Match } from '@/types/matches';

// Get all matches for a user
export const getUserMatches = async (userId: string): Promise<Match[]> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserMatches:', error);
    return [];
  }
};

// Get a specific match by ID
export const getMatchById = async (matchId: string): Promise<Match | null> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (error) {
      console.error('Error fetching match:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getMatchById:', error);
    return null;
  }
};
