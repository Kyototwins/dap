
import { SimplifiedProfile } from "@/types/simplified-profile";
import { Match } from "@/types/matches";
import { supabase } from "@/integrations/supabase/client";

// Define a type for enhanced matches to avoid deep type instantiations
export type EnhancedMatch = {
  id: string;
  createdAt: string;
  otherUserId: string;
  status: string;
  otherUser: Partial<SimplifiedProfile>;
};

/**
 * Enhances a single match with user profile information
 */
export async function enhanceMatchWithUserProfile(match: Match, currentUserId: string): Promise<EnhancedMatch> {
  // Determine which user ID is the "other" user
  const otherUserId = match.user1_id === currentUserId ? match.user2_id : match.user1_id;
  
  // Fetch user profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url')
    .eq('id', otherUserId)
    .single();
  
  if (error || !profile) {
    console.error('Error fetching profile for match:', error);
    // Return placeholder data if profile not found
    return {
      id: match.id,
      createdAt: match.created_at,
      otherUserId: otherUserId,
      status: match.status,
      otherUser: {
        id: otherUserId,
        first_name: 'User',
        last_name: '',
        avatar_url: '',
      },
    };
  }
  
  return {
    id: match.id,
    createdAt: match.created_at,
    otherUserId: otherUserId,
    status: match.status,
    otherUser: profile,
  };
}

/**
 * Enhances matches with user profile information
 */
export async function getEnhancedMatches(matches: Match[], userProfiles: Map<string, SimplifiedProfile>): Promise<EnhancedMatch[]> {
  const enhancedMatches: EnhancedMatch[] = [];
  
  for (const match of matches) {
    // For the Match type from the API, determine the other user ID
    const otherUserId = match.user1_id || match.user_id_1 || match.user2_id || match.user_id_2 || "";
    let otherUserProfile = userProfiles.get(otherUserId);
    
    // If profile is not in the provided map, create a placeholder
    if (!otherUserProfile) {
      otherUserProfile = {
        id: otherUserId,
        first_name: 'User',
        last_name: '',
        avatar_url: '',
        age: null,
        gender: null,
        origin: null,
        about_me: null,
        university: null,
        department: null,
        languages: null,
        learning_languages: null,
        language_levels: {},
        hobbies: null
      };
    }
    
    enhancedMatches.push({
      id: match.id,
      createdAt: match.created_at,
      otherUserId: otherUserId,
      status: match.status || 'pending',
      otherUser: otherUserProfile,
    });
  }
  
  return enhancedMatches;
}

/**
 * Fetches match data for a user
 */
export async function fetchMatches(userId: string) {
  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
  
  // Transform matches to have consistent structure
  return matches.map(match => {
    const isUser1 = match.user1_id === userId;
    return {
      id: match.id,
      created_at: match.created_at,
      status: match.status,
      user1_id: match.user1_id,
      user2_id: match.user2_id
    };
  });
}

/**
 * Fetches profile data for multiple users
 */
export async function fetchProfilesForMatches(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, SimplifiedProfile>();
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, age, gender, origin, about_me, university, department, languages, learning_languages, language_levels, hobbies')
    .in('id', userIds);
  
  if (error || !profiles) {
    console.error('Error fetching profiles for matches:', error);
    return new Map<string, SimplifiedProfile>();
  }
  
  // Create a map for easy lookup
  const profileMap = new Map<string, SimplifiedProfile>();
  profiles.forEach(profile => {
    profileMap.set(profile.id, profile as SimplifiedProfile);
  });
  
  return profileMap;
}
