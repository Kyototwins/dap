
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/date-utils";
import { Event } from "@/types/events";
import { Ribbon, Check, Edit, Loader2, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  isProcessing?: boolean;
}

export function EventCard({ event, isParticipating, onJoin, onCardClick, isProcessing = false }: EventCardProps) {
  const [isCreator, setIsCreator] = useState(false);
  const [displayedParticipants, setDisplayedParticipants] = useState(event.current_participants);
  const navigate = useNavigate();
  
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

  // Update displayed participants when the actual count changes
  useEffect(() => {
    setDisplayedParticipants(event.current_participants);
  }, [event.current_participants]);

  const displayCategory = categoryTranslationMap[event.category] || event.category;
  const eventDate = new Date(event.date);
  const currentDate = new Date();
  const isPastEvent = eventDate < currentDate;
  
  // Format date and time
  const formattedDate = format(eventDate, 'yyyy/MM/dd');
  
  // Format time - simplified to show just the start time
  const startTime = format(eventDate, 'h:mm a');
  
  // For unlimited participants, show the infinity symbol with current participants
  const participantsDisplay = event.max_participants === 0 
    ? `${displayedParticipants}/∞` 
    : `${displayedParticipants}/${event.max_participants}`;

  // Generate a Google Maps link
  const getMapLink = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://maps.google.com/maps?q=${encodedLocation}`;
  };

  // Handle button state for event participation
  let buttonText = "Join Event";
  let buttonClasses = "bg-[#7f1184] hover:bg-[#671073] text-white";
  let buttonIcon = null;
  
  if (isProcessing) {
    // Show different text based on current participation state
    buttonText = isParticipating ? "Cancelling..." : "Joining...";
    buttonClasses = "bg-gray-300 text-gray-600";
    buttonIcon = <Loader2 className="w-4 h-4 mr-1 animate-spin" />;
  } else if (isParticipating) {
    buttonText = "Cancel Participation";
    buttonClasses = "bg-gray-200 hover:bg-gray-300 text-gray-700";
    buttonIcon = <Check className="w-4 h-4 mr-1" />;
  } else if (isPastEvent) {
    buttonText = "Event Ended";
    buttonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed";
  } else if (event.max_participants !== 0 && displayedParticipants >= event.max_participants) {
    buttonText = "Full";
    buttonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed";
  }

  const isDisabled = isProcessing || isPastEvent || (!isParticipating && event.max_participants !== 0 && displayedParticipants >= event.max_participants);
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to edit event page
    navigate(`/events/edit/${event.id}`);
  };

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
              {formattedDate} {startTime}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center text-gray-600">
              <MapPin className="h-3 w-3 mr-1" /> 
              <a 
                href={getMapLink(event.location)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline hover:text-blue-600"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="font-medium mr-1">Place:</span>
                {event.location}
              </a>
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
            className={`flex-1 rounded-xl ${buttonClasses}`}
            disabled={isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              if (!isDisabled) onJoin(event.id, event.title);
            }}
          >
            {buttonIcon}
            {buttonText}
          </Button>
          
          {isCreator && (
            <Button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl"
              onClick={handleEditClick}
              title="Edit event"
              disabled={isProcessing}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
