
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationType } from "@/types/notifications";

export function useUnreadNotifications() {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [hasUnreadLikes, setHasUnreadLikes] = useState(false);
  const [hasUnreadEvents, setHasUnreadEvents] = useState(false);
  const location = useLocation();
  const { notifications } = useNotifications();

  // Check for unread messages
  useEffect(() => {
    const checkUnreadMessages = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // First, get all matches for the current user
        const { data: matchesData, error: matchesError } = await supabase
          .from("matches")
          .select(`
            id,
            user1_id, 
            user2_id
          `)
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

        if (matchesError) throw matchesError;
        if (!matchesData || matchesData.length === 0) {
          setHasUnreadMessages(false);
          return;
        }

        // For each match, get the latest message
        const matchPromises = matchesData.map(async (match) => {
          // Get latest message for this match
          const { data: latestMessage, error: messageError } = await supabase
            .from("messages")
            .select("id, match_id, sender_id, created_at")
            .eq("match_id", match.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (messageError || !latestMessage) return null;
          
          // Check if user is user1 or user2
          const isUser1 = match.user1_id === user.id;
          const lastReadFieldKey = isUser1 ? "user1_last_read" : "user2_last_read";
          
          // Get the last read timestamp for this user
          const { data: lastReadData, error: lastReadError } = await supabase
            .from("matches")
            .select(lastReadFieldKey)
            .eq("id", match.id)
            .single();
            
          if (lastReadError) return null;
          
          const lastReadTimestamp = lastReadData && lastReadData[lastReadFieldKey];
          
          // If no last read timestamp or message is newer than last read
          if (!lastReadTimestamp && latestMessage.sender_id !== user.id) {
            return { unread: true, match_id: match.id };
          } else if (lastReadTimestamp && latestMessage.created_at > lastReadTimestamp && latestMessage.sender_id !== user.id) {
            return { unread: true, match_id: match.id };
          }
          
          return { unread: false, match_id: match.id };
        });
        
        const results = await Promise.all(matchPromises);
        const hasUnread = results.some(result => result && result.unread);
        
        setHasUnreadMessages(hasUnread);
        console.log(`Unread messages found: ${hasUnread}`);
      } catch (error) {
        console.error("Error checking unread messages:", error);
        setHasUnreadMessages(false);
      }
    };

    // Clear the notification if on the messages page
    if (location.pathname === "/messages") {
      setHasUnreadMessages(false);
    } else {
      checkUnreadMessages();
    }
    
    // Check every 30 seconds for new unread messages
    const intervalId = setInterval(checkUnreadMessages, 30000);
    return () => clearInterval(intervalId);
  }, [location.pathname]);

  // Check for unread likes using the notifications context
  useEffect(() => {
    // Show notification for likes if we're not on the matches page
    if (location.pathname !== "/matches") {
      const unreadLikes = notifications.some(
        notification => 
          notification.type === NotificationType.NEW_MATCH && 
          !notification.read
      );
      setHasUnreadLikes(unreadLikes);
    } else {
      // Clear notification when on the matches page
      setHasUnreadLikes(false);
    }
  }, [notifications, location.pathname]);

  // Check for unread events using the notifications context
  useEffect(() => {
    // Show notification for events if we're not on the events page
    if (location.pathname !== "/events") {
      const unreadEvents = notifications.some(
        notification => 
          (notification.type === NotificationType.NEW_EVENT || 
           notification.type === NotificationType.EVENT_JOIN || 
           notification.type === NotificationType.EVENT_COMMENT) && 
          !notification.read
      );
      setHasUnreadEvents(unreadEvents);
    } else {
      // Clear notification when on the events page
      setHasUnreadEvents(false);
    }
  }, [notifications, location.pathname]);

  return {
    hasUnreadMessages,
    hasUnreadLikes,
    hasUnreadEvents
  };
}
