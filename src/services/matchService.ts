import { supabase } from '@/integrations/supabase/client';
import { Match, Profile } from '@/types/messages';

// Process language_levels field to handle both string and Record format
const processProfile = (profile: any): Profile => {
  // Parse language_levels if it's a string
  let processedLanguageLevels = profile.language_levels;
  if (typeof profile.language_levels === 'string') {
    try {
      processedLanguageLevels = JSON.parse(profile.language_levels);
    } catch (e) {
      console.error("Error parsing language levels:", e);
      // Keep it as is if parsing fails
    }
  }
  
  return {
    ...profile,
    language_levels: processedLanguageLevels,
    fcm_token: profile.fcm_token ?? null
  } as Profile;
};

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

// Enhance match with user profile information
export const enhanceMatchWithUserProfile = async (match: any, currentUserId: string): Promise<Match> => {
  // Get the other user's profile
  const otherUserId = match.user1_id === currentUserId ? match.user2_id : match.user1_id;
  
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', otherUserId)
    .single();
  
  // Process profile to ensure language_levels is handled correctly
  const otherUser = profileData ? processProfile(profileData) : null;
  
  // Get the last message for this match
  const { data: messagesData } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', match.id)
    .order('created_at', { ascending: false })
    .limit(1);

  const lastMessage = messagesData && messagesData.length > 0 ? messagesData[0] : null;

  // Count unread messages
  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('match_id', match.id)
    .eq('sender_id', otherUserId)
    .eq('read', false);

  // Determine match status
  let status = 'pending';
  if (match.accepted_1 && match.accepted_2) {
    status = 'matched';
  } else if (
    (match.user1_id === currentUserId && match.accepted_1) ||
    (match.user2_id === currentUserId && match.accepted_2)
  ) {
    status = 'waiting';
  }

  // Return enhanced match object
  return {
    ...match,
    otherUser,
    lastMessage,
    unreadCount: count || 0,
    status
  };
};

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
          user2_id: user2Id,
          accepted_1: false,
          accepted_2: false
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

    // Determine which user is accepting
    const isUser1 = match.user1_id === userId;
    const updateField = isUser1 ? 'accepted_1' : 'accepted_2';

    // Update the match
    const { error } = await supabase
      .from('matches')
      .update({ [updateField]: true })
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

// Get all enhanced matches for a user
export const getEnhancedMatches = async (userId: string): Promise<Match[]> => {
  try {
    const matches = await getUserMatches(userId);
    const enhancedMatches = await Promise.all(
      matches.map(match => enhanceMatchWithUserProfile(match, userId))
    );
    return enhancedMatches;
  } catch (error) {
    console.error('Error in getEnhancedMatches:', error);
    return [];
  }
};
