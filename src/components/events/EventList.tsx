
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  location: string;
  date: string;
  max_participants: number;
  current_participants: number;
  creator_id: string;
  category: string;
  creator?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

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
            ? "条件に合うイベントが見つかりませんでした"
            : "現在開催予定のイベントはありません"}
        </p>
        <div className="flex justify-center">
          <Button onClick={() => navigate("/events/new")} className="bg-amber-500 hover:bg-amber-600">
            <Plus className="w-4 h-4 mr-2" />
            作成
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg">イベント一覧</h2>
        <Button 
          onClick={() => navigate("/events/new")} 
          className="bg-amber-500 hover:bg-amber-600"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          作成
        </Button>
      </div>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isParticipating={!!participations[event.id]}
          onJoin={onJoinEvent}
          onCardClick={() => onSelectEvent(event)}
        />
      ))}
    </div>
  );
}

function EventCard({ event, isParticipating, onJoin, onCardClick }: {
  event: Event;
  isParticipating: boolean;
  onJoin: (eventId: string, eventTitle: string) => void;
  onCardClick: () => void;
}) {
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onCardClick}
    >
      {event.image_url && (
        <div className="relative h-40">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{event.title}</h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>{formatEventDate(event.date)}</span>
          <span>•</span>
          <span>{event.location}</span>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {event.category}
            </span>
            <span className="text-sm text-gray-500">
              {event.current_participants}/{event.max_participants}
            </span>
          </div>
          
          <Button
            size="sm"
            className={isParticipating 
              ? "bg-gray-200 hover:bg-gray-300 text-gray-700" 
              : "bg-amber-500 hover:bg-amber-600"}
            onClick={(e) => {
              e.stopPropagation();
              if (!isParticipating) onJoin(event.id, event.title);
            }}
            disabled={isParticipating || event.current_participants >= event.max_participants}
          >
            {isParticipating 
              ? "参加済み"
              : event.current_participants >= event.max_participants
                ? "満員"
                : "参加する"}
          </Button>
        </div>
      </div>
    </div>
  );
}
