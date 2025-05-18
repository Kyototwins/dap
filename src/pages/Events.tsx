
import EventsPage from "@/components/events/EventsPage";
import { memo, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationType } from "@/types/notifications";

function EventsComponent() {
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
    
    // Debug log
    console.log("Events page mounted and ready");
  }, [notifications, markAsRead]);

  return <EventsPage />;
}

// Create a memoized version and export as default
const Events = memo(EventsComponent);
export default Events;
