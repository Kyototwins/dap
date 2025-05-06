
import { Event } from "@/types/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventDetailsInfoProps {
  event: Event;
  isCreator: boolean;
  isParticipating?: boolean;
  isProcessing?: boolean;
  onParticipate?: (eventId: string, eventTitle: string) => void;
  onDeleteClick?: () => void;
}

const categoryTranslationMap: Record<string, string> = {
  'スポーツ': 'Sports',
  '勉強': 'Study',
  '食事': 'Meal',
  'カラオケ': 'Karaoke',
  '観光': 'Sightseeing',
  'その他': 'Other',
  // fallback if category is already English or others
  'Sports': 'Sports',
  'Study': 'Study',
  'Meal': 'Meal',
  'Karaoke': 'Karaoke',
  'Sightseeing': 'Sightseeing',
  'Other': 'Other',
};

export function EventDetailsInfo({ 
  event, 
  isCreator, 
  isParticipating = false,
  isProcessing = false,
  onParticipate,
  onDeleteClick 
}: EventDetailsInfoProps) {
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const displayCategory = categoryTranslationMap[event.category] || event.category;

  return (
    <>
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-48 object-cover rounded-lg"
        />
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{formatEventDate(event.date)}</span>
          <span>•</span>
          <span>{event.location}</span>
        </div>
        <Badge variant="outline" className="bg-gray-100">
          {displayCategory}
        </Badge>
        <div className="text-sm text-gray-600">
          Participants: {event.max_participants === 0 
            ? `${event.current_participants}/∞` 
            : `${event.current_participants}/${event.max_participants}`}
        </div>
        
        {/* Join Event button for non-creators */}
        {!isCreator && onParticipate && (
          <Button
            onClick={() => onParticipate(event.id, event.title)}
            disabled={isProcessing || isParticipating}
            variant={isParticipating ? "outline" : "default"}
            className={isParticipating ? "bg-gray-100" : ""}
            size="sm"
          >
            {isProcessing ? "Processing..." : isParticipating ? "Joined" : "Join Event"}
          </Button>
        )}
        
        {/* Delete button for creators */}
        {isCreator && onDeleteClick && (
          <Button 
            onClick={onDeleteClick}
            variant="destructive"
            size="sm"
          >
            Delete Event
          </Button>
        )}
      </div>
    </>
  );
}
