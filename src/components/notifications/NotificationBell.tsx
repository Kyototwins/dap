
import { Bell, BellDot } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { NotificationsList } from "./NotificationsList";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const { unreadCount, markAllAsRead, refetchNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [animateBell, setAnimateBell] = useState(false);
  const { toast } = useToast();

  // Animate bell when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0) {
      setAnimateBell(true);
      const timeout = setTimeout(() => setAnimateBell(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [unreadCount]);

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

  // Refresh notifications periodically
  useEffect(() => {
    // Initial fetch
    refetchNotifications();
    
    // Set up interval for periodic refreshes
    const interval = setInterval(() => {
      refetchNotifications();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [refetchNotifications]);

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
        <button className={cn(
          "relative p-2 mr-1 focus:outline-none focus:ring-2 focus:ring-doshisha-purple/40 rounded-full transition-transform",
          animateBell && "animate-bell"
        )}>
          {unreadCount > 0 ? (
            <BellDot className="h-5 w-5 text-doshisha-purple" />
          ) : (
            <Bell className="h-5 w-5 text-gray-700" />
          )}
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
