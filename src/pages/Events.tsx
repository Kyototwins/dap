
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { EventDetailsDialog } from "@/components/events/EventDetailsDialog";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventFilters } from "@/components/events/EventFilters";
import { EventList } from "@/components/events/EventList";
import { useEvents } from "@/hooks/useEvents";
import { joinEvent } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Events() {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    handleSubmitComment,
    fetchEvents
  } = useEvents();

  const handleJoinEvent = async (eventId: string, eventTitle: string) => {
    try {
      const eventToJoin = filteredEvents.find(e => e.id === eventId);
      if (!eventToJoin) throw new Error("Event not found");

      await joinEvent(eventId, eventTitle, eventToJoin.current_participants);
      
      // Update UI state
      await fetchEvents();
      
      toast({
        title: "Joined event",
        description: "You have successfully joined the event.",
      });
    } catch (error: any) {
      toast({
        title: "Error occurred",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const hasFilters = searchQuery !== "" || timeFilter !== "all" || categoryFilter !== "all";

  return (
    <div className="max-w-md mx-auto py-4 space-y-4">
      <EventsHeader
        onSearchChange={setSearchQuery}
      />
      
      <EventFilters
        timeFilter={timeFilter}
        categoryFilter={categoryFilter}
        onTimeFilterChange={setTimeFilter}
        onCategoryFilterChange={setCategoryFilter}
      />

      <EventList 
        events={filteredEvents}
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
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      />

      {/* Floating Create Event Button with simple text */}
      <div className="fixed bottom-16 right-6 z-10 flex flex-col items-end gap-2">
        <div className="flex justify-center w-full">
          <p className="text-[0.7rem] font-medium text-[#7f1184] leading-tight text-center">
            Add your<br />
            own event
          </p>
        </div>
        <Button 
          onClick={() => navigate("/events/new")} 
          className="bg-[#7f1184] hover:bg-[#671073] text-white rounded-full shadow-lg"
          size="icon"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
