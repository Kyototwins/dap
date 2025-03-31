
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { EventDetailsDialog } from "@/components/events/EventDetailsDialog";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventFilters } from "@/components/events/EventFilters";
import { EventList } from "@/components/events/EventList";
import { useEvents } from "@/hooks/useEvents";
import { joinEvent } from "@/services/eventService";

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
      if (!eventToJoin) throw new Error("イベントが見つかりません");

      await joinEvent(eventId, eventTitle, eventToJoin.current_participants);
      
      // Update UI state
      await fetchEvents();
      
      toast({
        title: "イベントに参加しました",
        description: "イベントに参加登録が完了しました。グループメッセージにも参加しました。",
      });
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const hasFilters = searchQuery !== "" || timeFilter !== "all" || categoryFilter !== "all";

  return (
    <div className="max-w-md mx-auto py-4 space-y-4">
      <EventsHeader
        unreadNotifications={0}
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
    </div>
  );
}
