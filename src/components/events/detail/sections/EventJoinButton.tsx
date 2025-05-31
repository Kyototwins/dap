
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface EventJoinButtonProps {
  isParticipating: boolean;
  isProcessing: boolean;
  onParticipate: (eventId: string, eventTitle: string) => void;
  eventId: string;
  eventTitle: string;
}

export function EventJoinButton({ 
  isParticipating, 
  isProcessing, 
  onParticipate, 
  eventId, 
  eventTitle 
}: EventJoinButtonProps) {
  const buttonText = isParticipating ? "Joined" : "Join Event";
  const buttonVariant = isParticipating ? "outline" : "default";
  const buttonClass = isParticipating 
    ? "bg-[#e5deff] text-[#7f1184] hover:bg-[#d8cefd] hover:text-[#7f1184]" 
    : "";
  const buttonIcon = isParticipating ? <Check className="w-4 h-4 mr-1" /> : null;

  return (
    <Button
      onClick={() => onParticipate(eventId, eventTitle)}
      disabled={isProcessing || isParticipating}
      variant={buttonVariant}
      className={buttonClass}
      size="sm"
    >
      {isProcessing ? "Processing..." : buttonText}
      {buttonIcon}
    </Button>
  );
}
