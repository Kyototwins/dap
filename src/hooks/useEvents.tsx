
import { useEffect } from "react";
import { Event } from "@/types/events";
import { useEventFilters } from "@/hooks/events/useEventFilters";
import { useEventComments } from "@/hooks/events/useEventComments";
import { useEventParticipations } from "@/hooks/events/useEventParticipations";
import { useEventCore } from "@/hooks/events/useEventCore";
import { useEventActions } from "@/hooks/events/useEventActions";
import { useEventListeners } from "@/hooks/events/useEventListeners";

export function useEvents() {
  const {
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent,
    loading,
    loadInitialData,
    refreshEvents
  } = useEventCore();

  const {
    filteredEvents,
    searchQuery,
    setSearchQuery,
    timeFilter,
    setTimeFilter,
    categoryFilter,
    setCategoryFilter,
    sortOption,
    setSortOption
  } = useEventFilters(events);

  const {
    comments,
    newComment,
    setNewComment,
    handleSubmitComment
  } = useEventComments(selectedEvent);

  const {
    participations,
    setParticipations,
    loadParticipations
  } = useEventParticipations();

  const {
    processingEventId,
    setProcessingEventId,
    deleteEvent
  } = useEventActions(setEvents);

  // Set up event listeners
  useEventListeners(loadParticipations, refreshEvents);

  // Initial data loading effect
  useEffect(() => {
    loadInitialData();
    loadParticipations();
  }, []);

  const handleSubmitEventComment = async () => {
    if (!selectedEvent) return;
    await handleSubmitComment(selectedEvent.id);
  };

  return {
    events,
    filteredEvents,
    selectedEvent,
    setSelectedEvent,
    comments,
    newComment,
    setNewComment,
    participations,
    setParticipations,
    loading,
    searchQuery,
    setSearchQuery,
    timeFilter,
    setTimeFilter,
    categoryFilter,
    setCategoryFilter,
    sortOption,
    setSortOption,
    handleSubmitComment: handleSubmitEventComment,
    fetchEvents: refreshEvents,
    refreshUserParticipations: loadParticipations,
    deleteEvent,
    processingEventId,
    setProcessingEventId
  };
}
