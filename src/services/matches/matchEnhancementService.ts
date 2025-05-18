
import { supabase } from '@/integrations/supabase/client';
import { Match } from '@/types/matches';
import { SimplifiedProfile } from '@/types/simplified-profile';
import { processProfile } from './profileUtils';

// Define a simplified return type to avoid circular references
export interface EnhancedMatch {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  status: string;
  otherUser?: Partial<SimplifiedProfile>;
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
    
    // Process profile to ensure language_levels is handled correctly and convert to SimplifiedProfile
    if (profileData) {
      // Process the profile data and extract only the properties we need
      const processedProfile = processProfile(profileData);
      
      // Create a simplified profile with only the essential properties
      enhancedMatch.otherUser = {
        id: processedProfile.id,
        first_name: processedProfile.first_name,
        last_name: processedProfile.last_name,
        avatar_url: processedProfile.avatar_url,
        age: processedProfile.age,
        gender: processedProfile.gender,
        origin: processedProfile.origin,
        about_me: processedProfile.about_me,
        university: processedProfile.university,
        department: processedProfile.department,
        languages: processedProfile.languages,
        learning_languages: processedProfile.learning_languages,
        language_levels: typeof processedProfile.language_levels === 'object' 
          ? processedProfile.language_levels as Record<string, number>
          : {},
        hobbies: processedProfile.hobbies
      };
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

    // Break the type reference chain by using a simple object type
    const matchesArray = matches as unknown as Array<{
      id: string;
      user1_id: string;
      user2_id: string;
      created_at: string;
      status: string;
    }>;
    
    // Process each match individually with simplified typing
    const enhancedMatches = await Promise.all(
      matchesArray.map(match => enhanceMatchWithUserProfile(match as Match, userId))
    );
    
    return enhancedMatches;
  } catch (error) {
    console.error('Error in getEnhancedMatches:', error);
    return [];
  }
};
