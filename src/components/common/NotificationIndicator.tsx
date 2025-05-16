
import { cn } from "@/lib/utils";

interface NotificationIndicatorProps {
  className?: string;
}

export function NotificationIndicator({ className }: NotificationIndicatorProps) {
  // Using blue color by default (if not overridden by className)
  return (
    <div 
      className={cn(
        "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full", 
        "bg-blue-500", // Default blue color
        className
      )}
    />
  );
}
