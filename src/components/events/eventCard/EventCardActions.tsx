
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Edit, Loader2 } from "lucide-react";

interface EventCardActionsProps {
  isCreator: boolean;
  isParticipating: boolean;
  isPastEvent: boolean;
  isProcessing: boolean;
  isDisabled: boolean;
  displayedParticipants: number;
  maxParticipants: number;
  onJoin: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
}

export function EventCardActions({ 
  isCreator, 
  isParticipating, 
  isPastEvent, 
  isProcessing, 
  isDisabled,
  displayedParticipants,
  maxParticipants,
  onJoin, 
  onEdit 
}: EventCardActionsProps) {
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
  } else if (maxParticipants !== 0 && displayedParticipants >= maxParticipants) {
    buttonText = "Full";
    buttonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed";
  }

  return (
    <div className="mt-4 flex gap-2">
      <Button
        className={`flex-1 rounded-xl ${buttonClasses}`}
        disabled={isDisabled}
        onClick={onJoin}
      >
        {buttonIcon}
        {buttonText}
      </Button>
      
      {isCreator && (
        <Button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl"
          onClick={onEdit}
          title="Edit event"
          disabled={isProcessing}
        >
          <Edit className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
