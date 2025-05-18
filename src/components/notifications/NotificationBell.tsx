
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { NotificationsList } from "./NotificationsList";
import { Badge } from "@/components/ui/badge";

export function NotificationBell() {
  const { unreadCount, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // Close popover when pressing escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      // Mark all as read when opening the notification panel
      markAllAsRead();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="relative p-2 mr-1">
          <Bell className="h-5 w-5 text-gray-700" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-[40vw] p-0" align="end">
        <NotificationsList onClose={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
