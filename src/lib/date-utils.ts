
/**
 * Format a date string to a localized date format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format a date string to a localized date and time format
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Check if a date is today
 */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * Check if a date is within this week
 */
export function isThisWeek(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  firstDayOfWeek.setHours(0, 0, 0, 0);
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23, 59, 59, 999);
  
  return date >= firstDayOfWeek && date <= lastDayOfWeek;
}

/**
 * Check if a date is within this month
 */
export function isThisMonth(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}
