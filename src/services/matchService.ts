import { supabase } from "@/integrations/supabase/client";
import type { Match, Profile } from "@/types/messages";

export const fetchUserMatches = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: matchesData, error } = await supabase
      .from("matches")
      .select("*")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

    if (error) throw error;

    return { matchesData, userId: user.id };
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};

// Fix for matchService.ts to handle the Profile type correctly with fcm_token

export const processMatch = async (match: any, userId: string) => {
  try {
    // Get other user in the match
    const otherUserId = match.user1_id === userId ? match.user2_id : match.user1_id;
    
    // Get other user profile
    const { data: otherUserData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', otherUserId)
      .single();
    
    if (profileError || !otherUserData) {
      console.error("Error fetching other user profile:", profileError);
      return null;
    }
    
    // Create proper Profile object with all required fields including fcm_token
    const otherUser: Profile = {
      id: otherUserData.id,
      created_at: otherUserData.created_at,
      first_name: otherUserData.first_name,
      last_name: otherUserData.last_name,
      age: otherUserData.age,
      gender: otherUserData.gender,
      origin: otherUserData.origin,
      about_me: otherUserData.about_me,
      avatar_url: otherUserData.avatar_url,
      sexuality: otherUserData.sexuality,
      university: otherUserData.university,
      department: otherUserData.department,
      year: otherUserData.year,
      image_url_1: otherUserData.image_url_1,
      image_url_2: otherUserData.image_url_2,
      ideal_date: otherUserData.ideal_date,
      life_goal: otherUserData.life_goal,
      superpower: otherUserData.superpower,
      worst_nightmare: otherUserData.worst_nightmare,
      friend_activity: otherUserData.friend_activity,
      best_quality: otherUserData.best_quality,
      photo_comment: otherUserData.photo_comment,
      hobby_photo_url: otherUserData.hobby_photo_url,
      hobby_photo_comment: otherUserData.hobby_photo_comment,
      hobbies: otherUserData.hobbies,
      languages: otherUserData.languages,
      learning_languages: otherUserData.learning_languages,
      language_levels: otherUserData.language_levels,
      pet_photo_url: otherUserData.pet_photo_url,
      pet_photo_comment: otherUserData.pet_photo_comment,
      fcm_token: otherUserData.fcm_token || null
    };
    
    // Process the rest of match data
    const enhancedMatch = {
      ...match,
      otherUser
    };

    // Fetch the last message for this match
    const { data: lastMessageData, error: lastMessageError } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', match.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lastMessageError) {
      console.error("Error fetching last message:", lastMessageError);
    }

    // Fetch unread message count
    const { count: unreadCount, error: unreadCountError } = await supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('match_id', match.id)
      .neq('sender_id', userId); // Assuming the current user is reading

    if (unreadCountError) {
      console.error("Error fetching unread message count:", unreadCountError);
    }

    const enhancedMatchWithLastMessage = {
      ...enhancedMatch,
      lastMessage: lastMessageData || null,
      unreadCount: unreadCount || 0
    };

    return enhancedMatchWithLastMessage;
  } catch (error) {
    console.error("Error processing match:", error);
    return null;
  }
};
