
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Check, Edit, Loader2, Plus, Trash2 } from "lucide-react";

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
  onEdit,
  onDelete,
  eventId
}: EventCardActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Handle button state for event participation
  let buttonText = isParticipating ? "Joined" : "Join Event";
  let buttonClasses = isParticipating 
    ? "bg-[#e5deff] hover:bg-[#e5deff] text-[#7f1184] cursor-default" 
    : "bg-[#7f1184] hover:bg-[#671073] text-white";
  let buttonIcon = isParticipating 
    ? <Check className="w-4 h-4 mr-1" /> 
    : <Plus className="w-4 h-4 mr-1" />;
  
  if (isProcessing) {
    buttonText = isParticipating ? "Processing..." : "Joining...";
    buttonClasses = "bg-gray-300 text-gray-600 cursor-wait";
    buttonIcon = <Loader2 className="w-4 h-4 mr-1 animate-spin" />;
  } else if (isPastEvent) {
    buttonText = "Event Ended";
    buttonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed";
    buttonIcon = null;
  } else if (!isParticipating && maxParticipants !== 0 && displayedParticipants >= maxParticipants) {
    buttonText = "Full";
    buttonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed";
    buttonIcon = null;
  }

  // Handle delete confirmation
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete();
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="mt-4 flex gap-2">
        <Button
          className={`flex-1 rounded-xl ${buttonClasses}`}
          disabled={isPastEvent || (!isParticipating && maxParticipants !== 0 && displayedParticipants >= maxParticipants) || isProcessing || isParticipating}
          onClick={onJoin}
          aria-label={buttonText}
        >
          {buttonIcon}
          {buttonText}
        </Button>
        
        {isCreator && (
          <>
            <Button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl"
              onClick={onEdit}
              title="Edit event"
              disabled={isProcessing}
              aria-label="Edit event"
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              className="bg-red-100 hover:bg-red-200 text-red-700 rounded-xl"
              onClick={handleDeleteClick}
              title="Delete event"
              disabled={isProcessing}
              aria-label="Delete event"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={e => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>Are you sure you want to delete this event? This action cannot be undone.</p>
              
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-amber-800 text-sm">
                <p className="font-semibold">Before deleting this event:</p>
                <ul className="mt-2 space-y-1 list-disc pl-4">
                  <li>If others have already signed up, consider updating the description instead—like letting them know you can't attend but they can still meet up.</li>
                  <li>Frequent deletions may affect your ability to host future events.</li>
                  <li>Please remember: canceling last-minute can inconvenience those who planned to join.</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={e => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={e => {
                e.stopPropagation();
                confirmDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
