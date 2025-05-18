
import { supabase } from '@/integrations/supabase/client';
import { Match } from '@/types/matches';
import { processProfile } from './profileUtils';

// Enhance match with user profile data
export const enhanceMatchWithUserProfile = async (match: Match, currentUserId: string): Promise<Match> => {
  // Create a new object with only the essential match properties to avoid circular references
  const enhancedMatch: Match = {
    id: match.id,
    user1_id: match.user1_id,
    user2_id: match.user2_id,
    created_at: match.created_at,
    status: match.status || 'pending'
  };
  
  try {
    // Get the other user's profile
    const otherUserId = match.user1_id === currentUserId ? match.user2_id : match.user1_id;
    
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', otherUserId)
      .single();
    
    // Process profile to ensure language_levels is handled correctly
    if (profileData) {
      enhancedMatch.otherUser = processProfile(profileData);
    }
    
    // Get the last message for this match
    const { data: messagesData } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', match.id)
      .order('created_at', { ascending: false })
      .limit(1);
  
    if (messagesData && messagesData.length > 0) {
      enhancedMatch.lastMessage = messagesData[0];
    }
  
    // Count unread messages
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('match_id', match.id)
      .eq('sender_id', otherUserId)
      .eq('read', false);
  
    enhancedMatch.unreadCount = count || 0;
  
    // Determine match status
    if (match.status === 'matched') {
      enhancedMatch.status = 'matched';
    } else if (
      (match.user1_id === currentUserId && match.status === 'pending') ||
      (match.user2_id === currentUserId && match.status === 'pending')
    ) {
      enhancedMatch.status = 'waiting';
    }
  
    return enhancedMatch;
  } catch (error) {
    console.error('Error enhancing match with user profile:', error);
    return enhancedMatch; // Return partially enhanced match if enhancement fails
  }
};

// Get all enhanced matches for a user
export const getEnhancedMatches = async (userId: string): Promise<Match[]> => {
  try {
    const { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);
      
    if (error || !matches) {
      console.error('Error fetching matches:', error);
      return [];
    }

    const enhancedMatches = await Promise.all(
      matches.map(match => enhanceMatchWithUserProfile(match, userId))
    );
    return enhancedMatches;
  } catch (error) {
    console.error('Error in getEnhancedMatches:', error);
    return [];
  }
};
