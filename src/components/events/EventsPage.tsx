
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { EventDetailsDialog } from "@/components/events/EventDetailsDialog";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventFilters } from "@/components/events/EventFilters";
import { EventList } from "@/components/events/EventList";
import { EventCalendarView } from "@/components/events/EventCalendarView";
import { useEvents } from "@/hooks/useEvents";
import { CreateEventButton } from "@/components/events/CreateEventButton";

export default function EventsPage() {
  const navigate = useNavigate();
  const [calendarViewOpen, setCalendarViewOpen] = useState(false);
  const [hidePastEvents, setHidePastEvents] = useState(false);
  const [hasCreatedEvent, setHasCreatedEvent] = useState(false);
  const [processingEventId, setProcessingEventId] = useState<string | null>(null);

  const {
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
    handleSubmitComment,
    fetchEvents,
    fetchUserParticipations
  } = useEvents();
  
  // Load participation status on component mount and when returning to this page
  useEffect(() => {
    const refreshData = () => {
      fetchUserParticipations();
    };
    
    // Initial load
    refreshData();
    
    // Set up a listener for when the component becomes visible again
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        console.log("Page visible, refreshing participation data");
        refreshData();
      }
    });
    
    return () => {
      document.removeEventListener("visibilitychange", refreshData);
    };
  }, []);
  
  useEffect(() => {
    // Check if user has created an event
    const createdEvent = localStorage.getItem('created_event');
    if (createdEvent) {
      setHasCreatedEvent(true);
    }
  }, []);
  
  // Filter out past events if the checkbox is checked
  let displayedEvents = filteredEvents;
  if (hidePastEvents) {
    const now = new Date();
    displayedEvents = displayedEvents.filter(event => new Date(event.date) >= now);
  }
  
  const hasFilters = searchQuery !== "" || timeFilter !== "all" || categoryFilter !== "all";
  
  const handleJoinEvent = async (eventId: string, eventTitle: string) => {
    try {
      // Prevent multiple clicks while processing
      if (processingEventId === eventId) return;
      setProcessingEventId(eventId);
      
      const { handleJoinEvent } = await import("@/components/events/EventJoinHandler");
      await handleJoinEvent(
        eventId, 
        eventTitle, 
        filteredEvents, 
        participations, 
        setParticipations, 
        fetchUserParticipations, 
        fetchEvents, 
        setProcessingEventId
      );
    } catch (error) {
      setProcessingEventId(null);
    }
  };
  
  return (
    <div className="max-w-md mx-auto py-2 space-y-3">
      <EventsHeader 
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        hidePastEvents={hidePastEvents}
        onHidePastEventsChange={setHidePastEvents}
        onCalendarViewClick={() => setCalendarViewOpen(true)}
      />
      
      <EventFilters 
        timeFilter={timeFilter} 
        categoryFilter={categoryFilter} 
        onTimeFilterChange={setTimeFilter} 
        onCategoryFilterChange={setCategoryFilter}
        hidePastEvents={hidePastEvents}
        onHidePastEventsChange={setHidePastEvents}
        onCalendarViewClick={() => setCalendarViewOpen(true)}
      />

      <EventList 
        events={displayedEvents} 
        loading={loading} 
        participations={participations} 
        onJoinEvent={handleJoinEvent} 
        onSelectEvent={setSelectedEvent} 
        hasFilters={hasFilters}
        processingEventId={processingEventId}
      />

      <EventDetailsDialog 
        event={selectedEvent} 
        comments={comments} 
        newComment={newComment} 
        setNewComment={setNewComment} 
        onSubmitComment={handleSubmitComment} 
        open={!!selectedEvent} 
        onOpenChange={open => !open && setSelectedEvent(null)}
        refreshEvents={fetchEvents}
      />

      <EventCalendarView 
        events={filteredEvents}
        participations={participations}
        open={calendarViewOpen}
        onOpenChange={setCalendarViewOpen}
      />

      <CreateEventButton 
        hasCreatedEvent={hasCreatedEvent} 
        navigate={navigate} 
      />
    </div>
  );
}
