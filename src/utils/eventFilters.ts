
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
  
  // Check for date filter in search query
  if (searchQuery.startsWith("date:")) {
    const dateString = searchQuery.substring(5);
    if (dateString.trim()) {
      const filterDate = new Date(dateString);
      filterDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(filterDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      result = result.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= filterDate && eventDate < nextDay;
      });
    }
    // Return date filtered results without applying text search
    if (timeFilter !== "all") {
      result = applyTimeFilter(result, timeFilter);
    }
    
    if (categoryFilter !== "all") {
      result = result.filter(event => event.category === categoryFilter);
    }
    
    return result;
  }
  
  // Apply text search filter
  if (searchQuery && !searchQuery.startsWith("date:")) {
    const query = searchQuery.toLowerCase();
    result = result.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query)
    );
  }
  
  // Apply time filter
  if (timeFilter !== "all") {
    result = applyTimeFilter(result, timeFilter);
  }
  
  // Apply category filter
  if (categoryFilter !== "all") {
    result = result.filter(event => event.category === categoryFilter);
  }
  
  return result;
}

function applyTimeFilter(events: Event[], timeFilter: TimeFilter): Event[] {
  return events.filter(event => {
    if (timeFilter === "today") return isToday(event.date);
    if (timeFilter === "this-week") return isThisWeek(event.date);
    if (timeFilter === "this-month") return isThisMonth(event.date);
    return true;
  });
}
