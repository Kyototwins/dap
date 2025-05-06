
import { useState, useEffect } from "react";
import { Event } from "@/types/events";
import { TimeFilter, CategoryFilter } from "@/components/events/EventFilters";
import { SortOption } from "@/components/events/EventSortOptions";
import { filterEvents } from "@/utils/eventFilters";

export function useEventFilters(events: Event[]) {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("date_asc");

  useEffect(() => {
    // Apply filters to events
    const filtered = filterEvents(events, searchQuery, timeFilter, categoryFilter);
    
    // Apply sorting
    const sorted = sortEvents(filtered, sortOption);
    
    // Remove events over a month old
    const current = new Date();
    const filteredByAge = sorted.filter(event => {
      const eventDate = new Date(event.date);
      const isPastEvent = eventDate < current;
      const isOlderThanMonth = isPastEvent && 
        (current.getTime() - eventDate.getTime()) > (30 * 24 * 60 * 60 * 1000);
      return !isOlderThanMonth;
    });
    
    setFilteredEvents(filteredByAge);
  }, [events, searchQuery, timeFilter, categoryFilter, sortOption]);

  const sortEvents = (eventsList: Event[], sort: SortOption): Event[] => {
    const sortedEvents = [...eventsList];
    
    switch (sort) {
      case 'newest':
        return sortedEvents.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'popular':
        return sortedEvents.sort((a, b) => 
          b.current_participants - a.current_participants
        );
      case 'date_asc':
        return sortedEvents.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      default:
        return sortedEvents;
    }
  };

  return {
    filteredEvents,
    searchQuery,
    setSearchQuery,
    timeFilter,
    setTimeFilter,
    categoryFilter,
    setCategoryFilter,
    sortOption,
    setSortOption
  };
}
