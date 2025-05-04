
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Event } from "@/types/events";
import { EventCard } from "@/components/events/EventCard";

interface EventListProps {
  events: Event[];
  loading: boolean;
  participations: { [key: string]: boolean };
  onJoinEvent: (eventId: string, eventTitle: string) => void;
  onSelectEvent: (event: Event) => void;
  hasFilters: boolean;
}

export function EventList({ 
  events, 
  loading, 
  participations, 
  onJoinEvent, 
  onSelectEvent,
  hasFilters
}: EventListProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-gray-100 rounded-lg p-4 space-y-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-gray-500">
          {hasFilters
            ? "No events found for these filters"
            : "No upcoming events"}
        </p>
        <div className="flex justify-center">
          <Button onClick={() => navigate("/events/new")} className="bg-doshisha-purple hover:bg-doshisha-darkPurple">
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isParticipating={!!participations[event.id]}
          onJoin={onJoinEvent}
          onCardClick={onSelectEvent}
        />
      ))}
    </div>
  );
}
