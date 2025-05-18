
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Notification, NotificationType } from '@/types/notifications';

interface NotificationContextProps {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  refetchNotifications: async () => {}
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // Helper function to convert string type to NotificationType enum
  const convertToNotificationType = (typeString: string): NotificationType => {
    switch (typeString) {
      case 'new_match':
        return NotificationType.NEW_MATCH;
      case 'new_message':
        return NotificationType.NEW_MESSAGE;
      case 'new_event':
        return NotificationType.NEW_EVENT;
      case 'event_join':
        return NotificationType.EVENT_JOIN;
      case 'event_comment':
        return NotificationType.EVENT_COMMENT;
      default:
        console.warn(`Unknown notification type: ${typeString}`);
        return NotificationType.NEW_MATCH; // Default fallback
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Convert string types to NotificationType enum
      const typedNotifications: Notification[] = (data || []).map(notification => ({
        ...notification,
        type: convertToNotificationType(notification.type)
      }));

      setNotifications(typedNotifications);
      setUnreadCount((data || []).filter(n => !n.read).length);
    } catch (error: any) {
      console.error('Error fetching notifications:', error.message);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      toast({
        title: "通知の更新に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      // Update local state
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch (error: any) {
      toast({
        title: "通知の更新に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
        }, 
        payload => {
          if (payload.new) {
            const newNotification = payload.new as any;
            // Convert string type to NotificationType enum for the new notification
            const typedNotification: Notification = {
              ...newNotification,
              type: convertToNotificationType(newNotification.type)
            };
            
            // Add new notification to state
            setNotifications(prev => [typedNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show toast for new notification
            toast({
              title: getNotificationTitle(typedNotification.type),
              description: typedNotification.content,
              variant: "default",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getNotificationTitle = (type: NotificationType): string => {
    switch (type) {
      case NotificationType.NEW_MATCH:
        return "新しいマッチング";
      case NotificationType.NEW_MESSAGE:
        return "新しいメッセージ";
      case NotificationType.NEW_EVENT:
        return "新しいイベント";
      case NotificationType.EVENT_JOIN:
        return "イベント参加";
      case NotificationType.EVENT_COMMENT:
        return "イベントコメント";
      default:
        return "新しい通知";
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead,
        refetchNotifications: fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
