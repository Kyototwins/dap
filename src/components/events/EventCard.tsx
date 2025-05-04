
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/date-utils";
import { Event } from "@/types/events";
import { Ribbon, Check, Edit } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  '勉強会': 'Study',
  '食事会': 'Meal',
};

interface EventCardProps {
  event: Event;
  isParticipating: boolean;
  onJoin: (eventId: string, eventTitle: string) => void;
  onCardClick: (event: Event) => void;
}

export function EventCard({ event, isParticipating, onJoin, onCardClick }: EventCardProps) {
  const [isCreator, setIsCreator] = useState(false);
  
  useEffect(() => {
    // Check if the current user is the creator of this event
    const checkIfCreator = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user && event.creator_id === data.user.id) {
        setIsCreator(true);
      }
    };
    
    checkIfCreator();
  }, [event.creator_id]);

  const displayCategory = categoryTranslationMap[event.category] || event.category;
  const eventDate = new Date(event.date);
  const currentDate = new Date();
  const isPastEvent = eventDate < currentDate;
  const isOlderThanMonth = isPastEvent && (currentDate.getTime() - eventDate.getTime()) > (30 * 24 * 60 * 60 * 1000);

  // Format date and time
  const formattedDate = format(eventDate, 'yyyy/MM/dd');
  
  // Format time range (assuming events last 2 hours if no end time is provided)
  const startTime = format(eventDate, 'h:mm a');
  const endTime = event.end_date 
    ? format(new Date(event.end_date), 'h:mm a') 
    : format(new Date(eventDate.getTime() + 2 * 60 * 60 * 1000), 'h:mm a');
  const timeRange = event.end_date ? `${startTime} - ${endTime}` : `${startTime}`;
  
  // For unlimited participants, show the infinity symbol with current participants
  const participantsDisplay = event.max_participants === 0 
    ? `${event.current_participants}/∞` 
    : `${event.current_participants}/${event.max_participants}`;

  return (
    <Card 
      className={`overflow-hidden cursor-pointer hover:shadow-lg transition-shadow rounded-xl border-[#e4e4e7] relative ${isPastEvent ? 'opacity-70' : ''}`}
      onClick={() => onCardClick(event)}
    >
      {isPastEvent && (
        <div className="absolute top-0 right-0 z-10 overflow-hidden w-20 h-20">
          <div className="absolute transform rotate-45 bg-[#444444] text-white text-xs font-bold py-1 text-center right-[-35px] top-[15px] w-[140px]">
            <span className="flex items-center justify-center gap-1">
              <Ribbon className="h-3 w-3" />
              Past Event
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
              alt={`${event.creator?.first_name}'s avatar`}
            />
          </Avatar>
          <div>
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-600">
              Organizer: {event.creator?.first_name} {event.creator?.last_name}
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
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              {event.location}
            </span>
            <span className="text-gray-600">
              {timeRange}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">
              Participants: {participantsDisplay}
            </span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            className={`flex-1 rounded-xl ${
              isParticipating 
                ? "bg-gray-200 hover:bg-gray-300 text-gray-700" 
                : isPastEvent 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-[#7f1184] hover:bg-[#671073] text-white"
            }`}
            disabled={isPastEvent}
            onClick={(e) => {
              e.stopPropagation();
              if (!isPastEvent) onJoin(event.id, event.title);
            }}
          >
            {isParticipating
              ? <>
                  <Check className="w-4 h-4 mr-1" />
                  Cancel Participation
                </>
              : isPastEvent
                ? "Event Ended"
                : event.max_participants !== 0 && event.current_participants >= event.max_participants
                  ? "Full"
                  : "Join Event"}
          </Button>
          
          {isCreator && (
            <Button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl"
              onClick={(e) => {
                e.stopPropagation();
                // Will be implemented in the details dialog
              }}
              title="Edit description"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
