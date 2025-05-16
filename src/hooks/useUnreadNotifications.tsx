
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

        // Check if there are any matches with unread messages
        const { data: matchesWithUnread, error } = await supabase
          .from("matches")
          .select(`
            id,
            user1_id, 
            user2_id,
            last_message_at,
            last_read_at
          `)
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .not("last_message_at", "is", null);

        if (error) throw error;

        // Filter matches where last_message_at > last_read_at or last_read_at is null
        const unreadMatches = (matchesWithUnread || []).filter(match => {
          // Determine if the current user is user1 or user2
          const isUser1 = match.user1_id === user.id;
          const lastReadField = isUser1 ? "user1_last_read" : "user2_last_read";
          
          if (!match[lastReadField] && match.last_message_at) {
            return true;
          }
          
          if (match[lastReadField] && match.last_message_at) {
            const lastRead = new Date(match[lastReadField]);
            const lastMessage = new Date(match.last_message_at);
            return lastMessage > lastRead;
          }
          
          return false;
        });

        setHasUnreadMessages(unreadMatches.length > 0);
        console.log(`Unread messages found: ${unreadMatches.length > 0}`);
      } catch (error) {
        console.error("Error checking unread messages:", error);
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
