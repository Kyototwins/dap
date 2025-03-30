
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EventCard, Event } from "@/components/events/EventCard";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
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
            ? "条件に合うイベントが見つかりませんでした"
            : "現在開催予定のイベントはありません"}
        </p>
        <Button onClick={() => navigate("/events/new")}>
          <Plus className="w-4 h-4 mr-2" />
          イベントを作成
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
