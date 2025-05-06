
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event, EventComment } from "@/types/events";
import { supabase } from "@/integrations/supabase/client";
import { EventDetailsHeader } from "./sections/EventDetailsHeader";
import { EventDetailsInfo } from "./sections/EventDetailsInfo";
import { EventDetailsDescription } from "./sections/EventDetailsDescription";
import { EventCommentSection } from "./sections/EventCommentSection";
import { EventDeleteDialog } from "./dialogs/EventDeleteDialog";
import { EventCommentsFullscreenDialog } from "./dialogs/EventCommentsFullscreenDialog";

interface EventDetailsDialogProps {
  event: Event | null;
  comments: EventComment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  onSubmitComment: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshEvents?: () => void;
  onDeleteEvent: (eventId: string) => void;
  isParticipating: boolean;
  onParticipate: (eventId: string, eventTitle: string) => void;
  isProcessing: boolean;
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
  isParticipating,
  onParticipate,
  isProcessing
}: EventDetailsDialogProps) {
  const [isCreator, setIsCreator] = useState(false);
  const [commentsFullscreen, setCommentsFullscreen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [displayedParticipants, setDisplayedParticipants] = useState(event?.current_participants || 0);
  const [editedDescription, setEditedDescription] = useState("");

  // Update displayed participants when the event data changes
  useEffect(() => {
    if (event) {
      setDisplayedParticipants(event.current_participants);
      setEditedDescription(event.description);
    }
  }, [event?.current_participants, event?.description]);

  useEffect(() => {
    // Check if current user is the creator when event changes
    if (event) {
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

  const handleDeleteButtonClick = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDeleteEvent(event.id);
    setDeleteDialogOpen(false);
    onOpenChange(false); // Close the main dialog
  };
  
  return (
    <>
      {/* Main event details dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[95vh] h-[95vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-lg">{event.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* Event basic info and participation button */}
            <EventDetailsInfo 
              event={event}
              isParticipating={isParticipating}
              isCreator={isCreator}
              isProcessing={isProcessing}
              displayedParticipants={displayedParticipants}
              setDisplayedParticipants={setDisplayedParticipants}
              onParticipate={onParticipate}
            />
            
            {/* Event description with edit capability */}
            <EventDetailsDescription 
              event={event}
              isCreator={isCreator}
              refreshEvents={refreshEvents}
              editedDescription={editedDescription}
              setEditedDescription={setEditedDescription}
              onDeleteClick={handleDeleteButtonClick}
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
      <EventCommentsFullscreenDialog 
        open={commentsFullscreen}
        onOpenChange={setCommentsFullscreen}
        event={event}
        comments={comments}
        newComment={newComment}
        setNewComment={setNewComment}
        onSubmitComment={onSubmitComment}
      />

      {/* Delete confirmation dialog */}
      <EventDeleteDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
      />
    </>
  );
}
