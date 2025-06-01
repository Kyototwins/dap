
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface EventJoinButtonProps {
  isParticipating: boolean;
  isProcessing: boolean;
  onParticipate: (eventId: string, eventTitle: string) => void;
  eventId: string;
  eventTitle: string;
  maxParticipants: number;
  currentParticipants: number;
}

export function EventJoinButton({ 
  isParticipating, 
  isProcessing, 
  onParticipate, 
  eventId, 
  eventTitle,
  maxParticipants,
  currentParticipants
}: EventJoinButtonProps) {
  const buttonText = isParticipating ? "Joined" : "Join Event";
  const buttonVariant = isParticipating ? "outline" : "default";
  const buttonClass = isParticipating 
    ? "bg-[#e5deff] text-[#7f1184] hover:bg-[#d8cefd] hover:text-[#7f1184]" 
    : "";
  const buttonIcon = isParticipating ? <Check className="w-4 h-4 mr-1" /> : null;

  // Check if event is full (only if max_participants is not 0)
  const isFull = maxParticipants !== 0 && currentParticipants >= maxParticipants;
  const isDisabled = isProcessing || isParticipating || isFull;

  const handleClick = () => {
    if (!isDisabled) {
      onParticipate(eventId, eventTitle);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      variant={buttonVariant}
      className={buttonClass}
      size="sm"
    >
      {isProcessing ? "Processing..." : isFull ? "Event Full" : buttonText}
      {buttonIcon}
    </Button>
  );
}
