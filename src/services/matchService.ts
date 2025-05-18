
import { supabase } from "@/integrations/supabase/client";
import { Match } from "@/types/messages";
import { createStandardizedUserObject, processLanguageLevels } from "@/utils/profileDataUtils";

/**
 * Fetches matches for the current authenticated user
 */
export async function fetchUserMatches() {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("User not authenticated");
    throw new Error("Not authenticated");
  }

  console.log("Authenticated user ID:", user.id);

  // Get matches where user is either user1 or user2
  const { data: matchesData, error } = await supabase
    .from("matches")
    .select(`
      id,
      user1_id,
      user2_id,
      status,
      created_at,
      user1:profiles!matches_user1_id_fkey (*),
      user2:profiles!matches_user2_id_fkey (*)
    `)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

  if (error) {
    console.error("Database error fetching matches:", error);
    throw error;
  }
  
  // Log all matches first to understand what's happening
  console.log(`Retrieved ${matchesData?.length || 0} raw matches (all statuses) for user ${user.id}`);
  if (matchesData && matchesData.length > 0) {
    console.log("All matches statuses:", matchesData.map(m => m.status).join(', '));
  }
  
  return { matchesData, userId: user.id };
}

/**
 * Fetches the latest message for a given match
 */
export async function fetchLatestMessage(matchId: string) {
  const { data: latestMessages, error: messagesError } = await supabase
    .from("messages")
    .select("content, created_at, sender_id")
    .eq("match_id", matchId)
    .order("created_at", { ascending: false })
    .limit(1);
    
  if (messagesError) {
    console.error("Error fetching messages for match:", matchId, messagesError);
  }
  
  return latestMessages && latestMessages.length > 0 ? latestMessages[0] : null;
}

/**
 * Processes a match to create a standardized Match object
 */
export async function processMatch(match: any, currentUserId: string): Promise<Match | null> {
  // Determine which user is the "other" user
  const otherUser = match.user1_id === currentUserId ? match.user2 : match.user1;
  if (!otherUser) {
    console.error(`Missing other user data for match ${match.id}`);
    return null;
  }
  
  console.log(`Processing match ${match.id} with other user:`, otherUser.id);
  
  // Fetch the most recent message for this match
  const lastMessage = await fetchLatestMessage(match.id);
  console.log(`Match ${match.id} last message:`, lastMessage || "No messages");
  
  // Count unread messages
  let unreadCount = 0;
  if (lastMessage && lastMessage.sender_id === otherUser.id) {
    // For now just mark as 1 if the last message is from other user
    unreadCount = 1;
  }
  
  // Create standardized other user object
  const otherUserWithRequiredProps = createStandardizedUserObject(otherUser);
  if (!otherUserWithRequiredProps) return null;
  
  return {
    id: match.id,
    status: match.status,
    user1_id: match.user1_id,
    user2_id: match.user2_id,
    otherUser: otherUserWithRequiredProps,
    lastMessage: lastMessage ? {
      content: lastMessage.content,
      created_at: lastMessage.created_at
    } : undefined,
    unreadCount: unreadCount
  } as Match;
}
