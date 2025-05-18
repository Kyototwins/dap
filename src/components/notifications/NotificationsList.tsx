
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Notification, NotificationType } from "@/types/notifications";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface NotificationsListProps {
  onClose: () => void;
}

export function NotificationsList({ onClose }: NotificationsListProps) {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate based on type
    if (notification.related_id) {
      // 新しいLIKE通知の場合はそのユーザーのプロフィールへ
      if (notification.type === NotificationType.NEW_MATCH) {
        navigate(`/profile/${notification.related_id}`);
      } else {
        switch (notification.type) {
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
    }

    onClose();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering the parent click handler
    setIsDeleting(id);
    try {
      await deleteNotification(id);
    } finally {
      setIsDeleting(null);
    }
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
      <div className="py-8 px-4 text-center text-muted-foreground">
        通知はありません
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
      <div className="py-2 px-4 font-medium bg-amber-50 text-amber-900 border-b flex justify-between items-center">
        <span>通知</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs" 
          onClick={() => markAllAsRead()}
        >
          <Check className="h-3.5 w-3.5 mr-1" />
          すべて既読
        </Button>
      </div>
      <ScrollArea className="max-h-[min(70vh,600px)]">
        <div className="divide-y">
          {notifications.map((notification) => (
            <div key={notification.id} className="group relative">
              <button
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-amber-50/50 ${
                  !notification.read ? 'bg-amber-50/30' : ''
                }`}
                onClick={() => handleClick(notification)}
                disabled={isDeleting === notification.id}
              >
                <div className="text-lg mt-0.5 flex-shrink-0">
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
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {isDeleting === notification.id ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-full hover:bg-red-100 hover:text-red-600"
                      onClick={(e) => handleDelete(e, notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">削除</span>
                    </Button>
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
