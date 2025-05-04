
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
  const [userHasCreatedEvents, setUserHasCreatedEvents] = useState(false);

  const {
    filteredEvents,
    selectedEvent,
    setSelectedEvent,
    comments,
    newComment,
    setNewComment,
    participations,
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
    fetchEvents
  } = useEvents();
  
  useEffect(() => {
    // Check if user has created any events
    const checkUserEvents = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: events, error } = await supabase
          .from("events")
          .select("id")
          .eq("creator_id", user.id)
          .limit(1);
          
        if (error) throw error;
        setUserHasCreatedEvents(events && events.length > 0);
      } catch (error) {
        console.error("Error checking user events:", error);
      }
    };
    
    checkUserEvents();
  }, []);
  
  const handleJoinEvent = async (eventId: string, eventTitle: string) => {
    try {
      const eventToJoin = filteredEvents.find(e => e.id === eventId);
      if (!eventToJoin) throw new Error("Event not found");
      await joinEvent(eventId, eventTitle, eventToJoin.current_participants);

      // Update UI state
      await fetchEvents();
      toast({
        title: "Joined event",
        description: "You have successfully joined the event."
      });
    } catch (error: any) {
      toast({
        title: "Error occurred",
        description: error.message,
        variant: "destructive"
      });
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
      />

      <EventCalendarView 
        events={filteredEvents}
        participations={participations}
        open={calendarViewOpen}
        onOpenChange={setCalendarViewOpen}
      />

      {/* Floating Create Event Button with speech bubble - only shown if user hasn't created events */}
      {!userHasCreatedEvents && (
        <div className="fixed bottom-16 right-6 z-10 flex flex-col items-end gap-2">
          <div className="flex justify-center w-full">
            <p className="text-[0.7rem] font-medium text-[#7f1184] leading-tight pl-4 pt-2 px-0 mx--1 text-center my--1">
              Add your<br />
              own event
            </p>
          </div>
          <Button onClick={() => navigate("/events/new")} className="bg-[#7f1184] hover:bg-[#671073] text-white rounded-full shadow-lg" size="icon">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>;
}
