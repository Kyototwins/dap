
import { Event } from "@/types/events";
import { TimeFilter, CategoryFilter } from "@/components/events/EventFilters";
import { isToday, isThisWeek, isThisMonth } from "@/lib/date-utils";

export function filterEvents(
  events: Event[],
  searchQuery: string,
  timeFilter: TimeFilter,
  categoryFilter: CategoryFilter
): Event[] {
  let result = [...events];
  
  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query)
    );
  }
  
  // Apply time filter
  if (timeFilter !== "all") {
    result = result.filter(event => {
      if (timeFilter === "today") return isToday(event.date);
      if (timeFilter === "this-week") return isThisWeek(event.date);
      if (timeFilter === "this-month") return isThisMonth(event.date);
      return true;
    });
  }
  
  // Apply category filter
  if (categoryFilter !== "all") {
    result = result.filter(event => event.category === categoryFilter);
  }
  
  return result;
}
