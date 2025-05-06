
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/events";
import { CheckIcon, Loader2, Plus } from "lucide-react";
import { categoryTranslationMap } from "../../utils/categoryTranslation";
import { useEffect, useState } from "react";

interface EventDetailsInfoProps {
  event: Event;
  isParticipating: boolean;
  isCreator: boolean;
  isProcessing: boolean;
  displayedParticipants: number;
  setDisplayedParticipants: React.Dispatch<React.SetStateAction<number>>;
  onParticipate: (eventId: string, eventTitle: string) => void;
}

export function EventDetailsInfo({
  event,
  isParticipating,
  isCreator,
  isProcessing,
  displayedParticipants,
  setDisplayedParticipants,
  onParticipate
}: EventDetailsInfoProps) {
  const [effectiveIsParticipating, setEffectiveIsParticipating] = useState(isParticipating);
  
  // Format event date
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  // Update participation status when props change
  useEffect(() => {
    if (isCreator) {
      setEffectiveIsParticipating(true);
    } else {
      setEffectiveIsParticipating(isParticipating);
    }
  }, [isParticipating, isCreator]);

  const displayCategory = categoryTranslationMap[event.category] || event.category;
  const eventDate = new Date(event.date);
  const currentDate = new Date();
  const isPastEvent = eventDate < currentDate;

  // Calculate if event is disabled for participation
  const isDisabled = isProcessing || 
    isPastEvent || 
    (!effectiveIsParticipating && event.max_participants !== 0 && displayedParticipants >= event.max_participants) || 
    effectiveIsParticipating;
  
  // Determine participation button state
  let participateButtonText = "イベントに参加する";
  let participateButtonClasses = "bg-[#7f1184] hover:bg-[#671073] text-white";
  let participateButtonIcon = <Plus className="w-4 h-4 mr-1" />;
  
  if (isProcessing) {
    participateButtonText = "参加中...";
    participateButtonClasses = "bg-gray-300 text-gray-600 cursor-wait";
    participateButtonIcon = <Loader2 className="w-4 h-4 mr-1 animate-spin" />;
  } else if (effectiveIsParticipating) {
    participateButtonText = "参加済み";
    participateButtonClasses = "bg-green-600 hover:bg-green-700 text-white";
    participateButtonIcon = <CheckIcon className="w-4 h-4 mr-1" />;
  } else if (isPastEvent) {
    participateButtonText = "イベント終了";
    participateButtonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed";
    participateButtonIcon = null;
  } else if (event.max_participants !== 0 && event.current_participants >= event.max_participants) {
    participateButtonText = "満員";
    participateButtonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed";
    participateButtonIcon = null;
  }

  const handleParticipateClick = () => {
    if (!isDisabled && !effectiveIsParticipating) {
      onParticipate(event.id, event.title);
      // Optimistically update the displayed participant count
      if (!isProcessing) {
        setDisplayedParticipants(prev => prev + 1);
      }
    }
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto flex-shrink-0">
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
          参加者: {event.max_participants === 0 
            ? `${displayedParticipants}/∞` 
            : `${displayedParticipants}/${event.max_participants}`}
        </div>
      </div>

      {/* Participation button */}
      <Button
        className={`w-full rounded-xl ${participateButtonClasses}`}
        disabled={isDisabled}
        onClick={handleParticipateClick}
      >
        {participateButtonIcon}
        {participateButtonText}
      </Button>
    </div>
  );
}
