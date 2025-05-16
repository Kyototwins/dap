
import { cn } from "@/lib/utils";

interface NotificationIndicatorProps {
  className?: string;
}

export function NotificationIndicator({ className }: NotificationIndicatorProps) {
  // Using the doshisha-purple color by default (if not overridden by className)
  return (
    <div 
      className={cn(
        "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full", 
        "bg-[#7F1184]", // Using the doshisha-purple color directly
        className
      )}
    />
  );
}
