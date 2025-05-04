
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/date-utils";
import { Event } from "@/types/events";
import { Ribbon } from "lucide-react";

const categoryTranslationMap: Record<string, string> = {
  'スポーツ': 'Sports',
  '勉強': 'Study',
  '食事': 'Meal',
  'カラオケ': 'Karaoke',
  '観光': 'Sightseeing',
  'その他': 'Other',
  'Sports': 'Sports',
  'Study': 'Study',
  'Meal': 'Meal',
  'Karaoke': 'Karaoke',
  'Sightseeing': 'Sightseeing',
  'Other': 'Other',
};

interface EventCardProps {
  event: Event;
  isParticipating: boolean;
  onJoin: (eventId: string, eventTitle: string) => void;
  onCardClick: (event: Event) => void;
}

export function EventCard({ event, isParticipating, onJoin, onCardClick }: EventCardProps) {
  const displayCategory = categoryTranslationMap[event.category] || event.category;
  const eventDate = new Date(event.date);
  const currentDate = new Date();
  const isPastEvent = eventDate < currentDate;
  const isOlderThanMonth = isPastEvent && (currentDate.getTime() - eventDate.getTime()) > (30 * 24 * 60 * 60 * 1000);

  return (
    <Card 
      className={`overflow-hidden cursor-pointer hover:shadow-lg transition-shadow rounded-xl border-[#e4e4e7] relative ${isOlderThanMonth ? 'opacity-70' : ''}`}
      onClick={() => onCardClick(event)}
    >
      {isPastEvent && (
        <div className="absolute top-0 right-0 z-10 overflow-hidden w-20 h-20">
          <div className="absolute transform rotate-45 bg-[#ff3838] text-white text-xs font-bold py-1 text-center right-[-35px] top-[15px] w-[140px]">
            <span className="flex items-center justify-center gap-1">
              <Ribbon className="h-3 w-3" />
              開催済み
            </span>
          </div>
        </div>
      )}
      <div className="relative aspect-video">
        <img
          src={event.image_url || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <img
              src={event.creator?.avatar_url || "/placeholder.svg"}
              alt={`${event.creator?.first_name}のアバター`}
            />
          </Avatar>
          <div>
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-600">
              主催: {event.creator?.first_name} {event.creator?.last_name}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {event.description}
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="language">{displayCategory}</Badge>
            <span className="text-gray-600">
              {formatDate(event.date)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              {event.location}
            </span>
            <span className="text-gray-600">
              参加者: {event.current_participants}/{event.max_participants}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <Button
            className={`w-full rounded-xl ${isParticipating ? "bg-gray-200 hover:bg-gray-300 text-gray-700" : isPastEvent ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#3b82f6] hover:bg-[#2563eb] text-white"}`}
            disabled={event.current_participants >= event.max_participants || isParticipating || isPastEvent}
            onClick={(e) => {
              e.stopPropagation();
              if (!isPastEvent && !isParticipating) onJoin(event.id, event.title);
            }}
          >
            {isParticipating 
              ? "参加済み"
              : isPastEvent
                ? "開催終了"
                : event.current_participants >= event.max_participants
                  ? "満員です"
                  : "参加する"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
