
import { supabase } from "@/integrations/supabase/client";
import type { Match } from "@/types/messages";

/**
 * Validates message content before sending
 * @param content Message content to validate
 * @returns Boolean indicating if message is valid
 */
export const validateMessage = (content: string, match: Match | null): boolean => {
  return !!(match && content.trim());
};

/**
 * Sends a message to the selected match
 * @param matchId ID of the match to send the message to
 * @param senderId ID of the sender
 * @param content Message content
 * @returns Result object with success status and message data
 */
export const sendMatchMessage = async (
  matchId: string,
  senderId: string,
  content: string
) => {
  try {
    const { error, data } = await supabase
      .from("messages")
      .insert([
        {
          match_id: matchId,
          sender_id: senderId,
          content: content.trim(),
        },
      ])
      .select();

    if (error) throw error;
    
    console.log("Message sent successfully:", data);
    
    return {
      success: true,
      messageData: data?.[0]
    };
  } catch (error: any) {
    console.error("Error sending message:", error.message);
    return { 
      success: false,
      error: error.message,
      messageData: undefined
    };
  }
};

/**
 * Sends a direct message with receiver information
 * @param messageData Message data including match_id, sender_id, receiver_id and content
 * @returns Response from database
 */
export const sendDirectMessage = async (messageData: {
  match_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([{
        match_id: messageData.match_id,
        sender_id: messageData.sender_id,
        content: messageData.content.trim(),
      }])
      .select();
    
    return { data: data?.[0], error };
  } catch (error) {
    console.error("Error sending direct message:", error);
    return { data: null, error };
  }
};

/**
 * Gets the current authenticated user
 * @returns Current authenticated user or null
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};
