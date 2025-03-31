
import { format } from "date-fns";

/**
 * Format message time for display in chat (HH:mm format)
 */
export function formatMessageTime(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return format(date, "HH:mm");
}

/**
 * Group messages by date for display in chat
 */
export function groupMessagesByDate(messages: any[]): { date: string; messages: any[] }[] {
  const groups: { date: string; messages: any[] }[] = [];
  
  messages.forEach((message) => {
    const messageDate = new Date(message.created_at);
    const dateStr = format(messageDate, "yyyy/MM/dd");
    
    const existingGroup = groups.find((group) => group.date === dateStr);
    
    if (existingGroup) {
      existingGroup.messages.push(message);
    } else {
      groups.push({ date: dateStr, messages: [message] });
    }
  });
  
  return groups;
}

/**
 * Format date for display in chat (Today, Yesterday, or date format)
 */
export function formatDisplayDate(dateStr: string): string {
  const messageDate = new Date(dateStr);
  const today = new Date();
  
  if (messageDate.toDateString() === today.toDateString()) {
    return "Today";
  } else if (messageDate.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()) {
    return "Yesterday";
  } else {
    return format(messageDate, "MMM d, yyyy");
  }
}
