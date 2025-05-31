
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";

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
  if (isPastEvent) {
    return null;
  }

  return (
    <div className="flex gap-2 mt-4">
      {!isCreator && (
        <Button
          onClick={onJoin}
          disabled={isDisabled}
          variant={isParticipating ? "outline" : "default"}
          className={`flex-1 text-sm ${
            isParticipating 
              ? "bg-[#e5deff] text-[#7f1184] hover:bg-[#d8cefd] hover:text-[#7f1184]" 
              : ""
          }`}
          size="sm"
        >
          {isProcessing ? (
            "Processing..."
          ) : isParticipating ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Joined
            </>
          ) : isDisabled && maxParticipants !== 0 && displayedParticipants >= maxParticipants ? (
            "Full"
          ) : (
            "Join"
          )}
        </Button>
      )}
      
      {isCreator && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
