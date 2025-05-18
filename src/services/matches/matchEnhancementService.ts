
import { supabase } from '@/integrations/supabase/client';
import { Match } from '@/types/matches';
import { Profile } from '@/types/messages';
import { processProfile } from './profileUtils';

// Define a simplified return type to avoid circular references
export interface EnhancedMatch {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  status: string;
  otherUser?: Partial<Profile>;
  lastMessage?: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    match_id?: string;
  };
  unreadCount?: number;
}

// Enhance match with user profile data
export const enhanceMatchWithUserProfile = async (match: Match, currentUserId: string): Promise<EnhancedMatch> => {
  // Create a new object with only the essential match properties to avoid circular references
  const enhancedMatch: EnhancedMatch = {
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
      // Explicitly define the structure of lastMessage to avoid circular references
      enhancedMatch.lastMessage = {
        id: messagesData[0].id,
        content: messagesData[0].content,
        created_at: messagesData[0].created_at,
        sender_id: messagesData[0].sender_id,
        match_id: messagesData[0].match_id
      };
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
export const getEnhancedMatches = async (userId: string): Promise<EnhancedMatch[]> => {
  try {
    const { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);
      
    if (error || !matches) {
      console.error('Error fetching matches:', error);
      return [];
    }

    // Use type assertion to avoid type errors during mapping
    const enhancedMatches = await Promise.all(
      matches.map(match => enhanceMatchWithUserProfile(match as Match, userId))
    );
    return enhancedMatches;
  } catch (error) {
    console.error('Error in getEnhancedMatches:', error);
    return [];
  }
};
