
import EventsPage from "@/components/events/EventsPage";
import { memo, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationType } from "@/types/notifications";

export default memo(function Events() {
  const { notifications, markAsRead } = useNotifications();

  // Mark event-related notifications as read when viewing events page
  useEffect(() => {
    const eventNotifications = notifications.filter(n => 
      (n.type === NotificationType.NEW_EVENT || 
       n.type === NotificationType.EVENT_JOIN || 
       n.type === NotificationType.EVENT_COMMENT) && 
      !n.read
    );
    
    eventNotifications.forEach(notification => {
      markAsRead(notification.id);
    });
  }, [notifications, markAsRead]);

  return <EventsPage />;
});
