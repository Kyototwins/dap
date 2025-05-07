
import React, { useState } from "react";
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
  onDelete: (e: React.MouseEvent) => void;
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
  let buttonText = "Join Event";
  let buttonClasses = "bg-[#7f1184] hover:bg-[#671073] text-white";
  let buttonIcon = <Plus className="w-4 h-4 mr-1" />;
  
  if (isProcessing) {
    buttonText = "Joining...";
    buttonClasses = "bg-gray-300 text-gray-600 cursor-wait";
    buttonIcon = <Loader2 className="w-4 h-4 mr-1 animate-spin" />;
  } else if (isParticipating) {
    buttonText = "Joined";
    buttonClasses = "bg-[#e5deff] hover:bg-[#e5deff] text-[#7f1184] cursor-default"; // Make it non-interactive
    buttonIcon = <Check className="w-4 h-4 mr-1" />;
  } else if (isPastEvent) {
    buttonText = "Event Ended";
    buttonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed";
    buttonIcon = null;
  } else if (maxParticipants !== 0 && displayedParticipants >= maxParticipants) {
    buttonText = "Full";
    buttonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed";
    buttonIcon = null;
  }

  // Handle delete confirmation
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(e);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="mt-4 flex gap-2">
        <Button
          className={`flex-1 rounded-xl ${buttonClasses}`}
          disabled={isDisabled}
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
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={e => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
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
