
import { Event } from "@/types/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link2, MapPin, Check } from "lucide-react";

interface EventDetailsInfoProps {
  event: Event;
  isCreator: boolean;
  isParticipating?: boolean;
  isProcessing?: boolean;
  onDeleteClick?: () => void;
  onParticipate?: (eventId: string, eventTitle: string) => void;
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
  onDeleteClick,
  onParticipate
}: EventDetailsInfoProps) {
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const displayCategory = categoryTranslationMap[event.category] || event.category;
  
  // Determine button text and styling based on participation status
  const buttonText = isParticipating ? "Joined" : "Join Event";
  const buttonVariant = isParticipating ? "outline" : "default";
  const buttonClass = isParticipating 
    ? "bg-[#e5deff] text-[#7f1184] hover:bg-[#d8cefd] hover:text-[#7f1184]" 
    : "";
  const buttonIcon = isParticipating ? <Check className="w-4 h-4 mr-1" /> : null;

  return (
    <>
      <div className="relative">
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{formatEventDate(event.date)}</span>
          <span>•</span>
          <span>{event.location}</span>
        </div>
        
        {/* Location and Map Link */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
          {event.map_link && (
            <a 
              href={event.map_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-500 hover:text-blue-600 hover:underline ml-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Link2 className="h-4 w-4 mr-1" />
              <span>Map</span>
            </a>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-gray-100">
            {displayCategory}
          </Badge>
          
          {/* Join button for non-creators */}
          {!isCreator && onParticipate && (
            <Button
              onClick={() => onParticipate(event.id, event.title)}
              disabled={isProcessing || isParticipating}
              variant={buttonVariant}
              className={buttonClass}
              size="sm"
            >
              {isProcessing ? "Processing..." : buttonText}
              {buttonIcon}
            </Button>
          )}
        </div>
        <div className="text-sm text-gray-600">
          Participants: {event.max_participants === 0 
            ? `${event.current_participants}/∞` 
            : `${event.current_participants}/${event.max_participants}`}
        </div>
        
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
