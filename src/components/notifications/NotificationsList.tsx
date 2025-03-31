
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Notification, NotificationType } from "@/types/notifications";
import { useNavigate } from "react-router-dom";

interface NotificationsListProps {
  onClose: () => void;
}

export function NotificationsList({ onClose }: NotificationsListProps) {
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate based on type
    if (notification.related_id) {
      switch (notification.type) {
        case NotificationType.NEW_MATCH:
          navigate("/matches");
          break;
        case NotificationType.NEW_MESSAGE:
          navigate("/messages");
          break;
        case NotificationType.NEW_EVENT:
        case NotificationType.EVENT_JOIN:
        case NotificationType.EVENT_COMMENT:
          navigate("/events");
          break;
      }
    }
    
    onClose();
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.NEW_MATCH:
        return "🔥";
      case NotificationType.NEW_MESSAGE:
        return "💬";
      case NotificationType.NEW_EVENT:
        return "🎉";
      case NotificationType.EVENT_JOIN:
        return "👋";
      case NotificationType.EVENT_COMMENT:
        return "💭";
      default:
        return "📣";
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="py-6 px-4 text-center text-muted-foreground">
        通知はありません
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
      <div className="py-2 px-4 font-medium bg-amber-50 text-amber-900 border-b">
        通知
      </div>
      <ScrollArea className="max-h-[350px]">
        <div className="divide-y">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-amber-50/50 ${
                !notification.read ? 'bg-amber-50/30' : ''
              }`}
              onClick={() => handleClick(notification)}
            >
              <div className="text-lg">
                {getNotificationIcon(notification.type as NotificationType)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm line-clamp-2">{notification.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notification.created_at), { 
                    addSuffix: true,
                    locale: ja
                  })}
                </p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
