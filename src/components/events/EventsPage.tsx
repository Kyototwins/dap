
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EventsHeader } from "./layout/EventsHeader";
import { EventFilters } from "./layout/EventFilters";
import { EventList } from "./list/EventList";
import { EventDetailsDialog } from "./detail/EventDetailsDialog";
import { EventCalendarView } from "./calendar/EventCalendarView";
import { CreateEventButton } from "./actions/CreateEventButton";
import { useEvents } from "@/hooks/useEvents";
import { handleJoinEvent } from "./EventJoinHandler";

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
    deleteEvent,
    refreshUserParticipations
  } = useEvents();
  
  // Load participation status on component mount and when returning to this page
  useEffect(() => {
    const refreshData = async () => {
      await refreshUserParticipations();
      await fetchEvents();
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
  
  const handleEventParticipation = async (eventId: string, eventTitle: string) => {
    try {
      // Prevent multiple clicks while processing
      if (processingEventId) return;
      
      await handleJoinEvent(
        eventId, 
        eventTitle, 
        filteredEvents, 
        participations, 
        setParticipations,
        refreshUserParticipations,
        fetchEvents,
        setProcessingEventId
      );
      
      // If we're viewing the event details, update selected event to reflect changes
      if (selectedEvent && selectedEvent.id === eventId) {
        const updatedEvent = filteredEvents.find(event => event.id === eventId);
        if (updatedEvent) {
          setSelectedEvent(updatedEvent);
        }
      }
    } catch (error) {
      console.error("Error handling event action:", error);
      setProcessingEventId(null);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    const success = await deleteEvent(eventId);
    if (success && selectedEvent?.id === eventId) {
      setSelectedEvent(null);
    }
  };
  
  return (
    <div className="max-w-md mx-auto py-2 space-y-3">
      <EventsHeader 
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
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
        onJoinEvent={handleEventParticipation}
        onDeleteEvent={handleDeleteEvent}
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
        onDeleteEvent={handleDeleteEvent}
        isParticipating={selectedEvent ? !!participations[selectedEvent.id] : false}
        onParticipate={handleEventParticipation}
        isProcessing={selectedEvent ? processingEventId === selectedEvent.id : false}
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
