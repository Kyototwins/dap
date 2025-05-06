
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { EventDetailsDialog } from "@/components/events/EventDetailsDialog";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventFilters } from "@/components/events/EventFilters";
import { EventList } from "@/components/events/EventList";
import { EventCalendarView } from "@/components/events/EventCalendarView";
import { useEvents } from "@/hooks/useEvents";
import { joinEvent } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SortOption } from "@/components/events/EventSortOptions";
import { supabase } from "@/integrations/supabase/client";

export default function Events() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [calendarViewOpen, setCalendarViewOpen] = useState(false);
  const [hidePastEvents, setHidePastEvents] = useState(false);
  const [hasCreatedEvent, setHasCreatedEvent] = useState(false);

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
  
  useEffect(() => {
    // Check if user has created an event
    const createdEvent = localStorage.getItem('created_event');
    if (createdEvent) {
      setHasCreatedEvent(true);
    }
  }, []);
  
  const handleJoinEvent = async (eventId: string, eventTitle: string) => {
    try {
      const eventToJoin = filteredEvents.find(e => e.id === eventId);
      if (!eventToJoin) throw new Error("Event not found");
      
      // Get current participation status
      const isCurrentlyParticipating = !!participations[eventId];
      
      // Update UI optimistically
      const updatedParticipations = { ...participations };
      
      if (isCurrentlyParticipating) {
        delete updatedParticipations[eventId];
      } else {
        updatedParticipations[eventId] = true;
      }
      
      // Update UI immediately for better UX
      setParticipations(updatedParticipations);
      
      // Call backend to update participation
      const isNowParticipating = await joinEvent(eventId, eventTitle, eventToJoin.current_participants);
      
      console.log("Join event result:", isNowParticipating, "for event", eventId);
      
      // Refresh data to ensure UI is in sync with server
      await fetchEvents();
      await fetchUserParticipations();
      
      // Show toast notification
      toast({
        title: isNowParticipating ? "Joined event" : "Cancelled participation",
        description: isNowParticipating 
          ? "You have successfully joined the event." 
          : "You have cancelled your participation."
      });
    } catch (error: any) {
      console.error("Join event error:", error);
      // Revert UI on error
      toast({
        title: "Error occurred",
        description: error.message,
        variant: "destructive"
      });
      // Reset data from server
      fetchUserParticipations();
      fetchEvents();
    }
  };
  
  // Filter out past events if the checkbox is checked
  let displayedEvents = filteredEvents;
  if (hidePastEvents) {
    const now = new Date();
    displayedEvents = displayedEvents.filter(event => new Date(event.date) >= now);
  }
  
  const hasFilters = searchQuery !== "" || timeFilter !== "all" || categoryFilter !== "all";
  
  return <div className="max-w-md mx-auto py-2 space-y-3">
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

      {/* Show the Floating Create Event Button with speech bubble only if user hasn't created an event */}
      <div className="fixed bottom-16 right-6 z-10 flex flex-col items-end gap-2">
        {!hasCreatedEvent && (
          <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-md relative">
            <p className="text-[0.7rem] font-medium text-[#7f1184] leading-tight">
              Add your<br />
              own event
            </p>
            {/* Triangle for speech bubble effect */}
            <div className="absolute bottom-[-8px] right-5 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
          </div>
        )}
        <Button onClick={() => navigate("/events/new")} className="bg-[#7f1184] hover:bg-[#671073] text-white rounded-full shadow-lg" size="icon">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>;
}
