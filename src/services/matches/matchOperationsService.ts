
import { supabase } from '@/integrations/supabase/client';
import { Match } from '@/types/matches';

// Create a new match between two users
export const createMatch = async (user1Id: string, user2Id: string): Promise<Match | null> => {
  try {
    // Check if a match already exists
    const { data: existingMatch } = await supabase
      .from('matches')
      .select('*')
      .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
      .maybeSingle();

    if (existingMatch) {
      console.log('Match already exists:', existingMatch);
      return existingMatch;
    }

    // Create a new match
    const { data, error } = await supabase
      .from('matches')
      .insert([
        {
          user1_id: user1Id,
          user2_id: user2Id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating match:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createMatch:', error);
    return null;
  }
};

// Accept a match
export const acceptMatch = async (matchId: string, userId: string): Promise<boolean> => {
  try {
    // Get the match first
    const { data: match, error: fetchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (fetchError || !match) {
      console.error('Error fetching match:', fetchError);
      return false;
    }

    // Update match status to 'matched'
    const { error } = await supabase
      .from('matches')
      .update({ status: 'matched' })
      .eq('id', matchId);

    if (error) {
      console.error('Error accepting match:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in acceptMatch:', error);
    return false;
  }
};

// Reject a match
export const rejectMatch = async (matchId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', matchId);

    if (error) {
      console.error('Error rejecting match:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in rejectMatch:', error);
    return false;
  }
};
