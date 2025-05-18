
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Event, EventComment } from "@/types/events";
import { EventDetailsHeader } from "./sections/EventDetailsHeader";
import { EventDetailsInfo } from "./sections/EventDetailsInfo";
import { EventDetailsDescription } from "./sections/EventDetailsDescription";
import { EventCommentSection } from "./sections/EventCommentSection";
import { EventCommentsFullscreenDialog } from "./dialogs/EventCommentsFullscreenDialog";
import { EventDeleteDialog } from "./dialogs/EventDeleteDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EventDetailsDialogProps {
  event: Event | null;
  comments: EventComment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  onSubmitComment: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshEvents?: () => void;
  onDeleteEvent?: (eventId: string) => void;
  isParticipating?: boolean;
  onParticipate?: (eventId: string, eventTitle: string) => void;
  isProcessing?: boolean;
}

export function EventDetailsDialog({
  event,
  comments,
  newComment,
  setNewComment,
  onSubmitComment,
  open,
  onOpenChange,
  refreshEvents,
  onDeleteEvent,
  isParticipating = false,
  onParticipate,
  isProcessing = false
}: EventDetailsDialogProps) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [commentsFullscreen, setCommentsFullscreen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if current user is the creator when event changes
    if (event) {
      setEditedDescription(event.description);
      
      const checkIfCreator = async () => {
        const { data } = await supabase.auth.getUser();
        if (data.user && event.creator_id === data.user.id) {
          setIsCreator(true);
        } else {
          setIsCreator(false);
        }
      };
      
      checkIfCreator();
    }
  }, [event]);

  if (!event) return null;

  const saveDescription = async () => {
    if (!event) return;
    
    try {
      const { error } = await supabase
        .from("events")
        .update({ description: editedDescription })
        .eq("id", event.id);
      
      if (error) throw error;
      
      toast({
        title: "Description updated",
        description: "Event description has been updated successfully."
      });
      
      setIsEditingDescription(false);
      // Refresh events if provided
      if (refreshEvents) refreshEvents();
      
    } catch (error: any) {
      toast({
        title: "Error updating description",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (event && onDeleteEvent) {
      onDeleteEvent(event.id);
      setShowDeleteDialog(false);
      onOpenChange(false); // Close the details dialog
    }
  };

  return (
    <>
      {/* Main event details dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[95vh] h-[95vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
            <DialogTitle className="text-lg">{event.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* Event basic info */}
            <div className="p-4 space-y-4 overflow-y-auto flex-shrink-0 relative">
              {/* Event details information */}
              <EventDetailsInfo 
                event={event}
                isCreator={isCreator}
                isParticipating={isParticipating}
                isProcessing={isProcessing}
                onDeleteClick={handleDeleteClick}
                onParticipate={onParticipate}
              />
            </div>
            
            {/* Event description section */}
            <EventDetailsDescription 
              event={event}
              isCreator={isCreator}
              isEditingDescription={isEditingDescription}
              editedDescription={editedDescription}
              setIsEditingDescription={setIsEditingDescription}
              setEditedDescription={setEditedDescription}
              saveDescription={saveDescription}
            />
            
            {/* Comment section */}
            <EventCommentSection
              comments={comments}
              newComment={newComment}
              setNewComment={setNewComment}
              onSubmitComment={onSubmitComment}
              onExpandClick={() => setCommentsFullscreen(true)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen comments dialog */}
      {event && (
        <EventCommentsFullscreenDialog
          open={commentsFullscreen}
          onOpenChange={setCommentsFullscreen}
          event={event}
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          onSubmitComment={onSubmitComment}
        />
      )}

      {/* Delete confirmation dialog */}
      <EventDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
}
