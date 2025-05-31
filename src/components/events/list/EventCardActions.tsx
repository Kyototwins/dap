
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { EventDeleteDialog } from "../detail/dialogs/EventDeleteDialog";
import { useState } from "react";

interface EventCardActionsProps {
  isCreator: boolean;
  isParticipating: boolean;
  isPastEvent: boolean;
  isProcessing: boolean;
  isDisabled: boolean;
  displayedParticipants: number;
  maxParticipants: number;
  onJoin: (e: React.MouseEvent) => void;
  onDelete: () => void;
  eventId: string;
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
  onDelete,
  eventId
}: EventCardActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Determine button text and styling based on participation status
  const buttonText = isParticipating ? "Joined" : "Join Event";
  const buttonVariant = isParticipating ? "outline" : "default";
  const buttonClass = isParticipating 
    ? "bg-[#e5deff] text-[#7f1184] hover:bg-[#d8cefd] hover:text-[#7f1184]" 
    : "";
  const buttonIcon = isParticipating ? <Check className="w-4 h-4 mr-1" /> : null;

  // Check if event is full (only if max_participants is not 0)
  const isFull = maxParticipants !== 0 && displayedParticipants >= maxParticipants;
  const showFullMessage = isFull && !isParticipating && !isPastEvent;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex justify-between items-center">
        {/* Join button for non-creators */}
        {!isCreator && (
          <Button
            onClick={onJoin}
            disabled={isDisabled}
            variant={buttonVariant}
            className={`flex-1 ${buttonClass}`}
            size="sm"
          >
            {isProcessing ? "Processing..." : buttonText}
            {buttonIcon}
          </Button>
        )}
        
        {/* Creator actions */}
        {isCreator && (
          <div className="flex gap-2 w-full">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialogOpen(true);
              }}
              variant="destructive"
              size="sm"
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>
      
      {/* Show "Event Full" message if applicable */}
      {showFullMessage && (
        <p className="text-xs text-red-500 text-center">Event is full</p>
      )}
      
      {/* Past event message */}
      {isPastEvent && (
        <p className="text-xs text-gray-500 text-center">This event has ended</p>
      )}

      <EventDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={onDelete}
        eventId={eventId}
      />
    </div>
  );
}
