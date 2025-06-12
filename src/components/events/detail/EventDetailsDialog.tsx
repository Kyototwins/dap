
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Event, EventComment } from "@/types/events";
import { EventDetailsInfo } from "./sections/EventDetailsInfo";
import { EventDetailsDescription } from "./sections/EventDetailsDescription";
import { EventCommentSection } from "./sections/EventCommentSection";
import { EventImageSection } from "./sections/EventImageSection";
import { EventActionsSection } from "./sections/EventActionsSection";
import { EventParticipationFormSection } from "./sections/EventParticipationFormSection";
import { EventCommentsFullscreenDialog } from "./dialogs/EventCommentsFullscreenDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

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

  return (
    <>
      {/* Main event details dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b flex flex-row items-center justify-between flex-shrink-0">
            <DialogTitle className="text-lg pr-4">{event.title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="pb-4">
              {/* Event image section */}
              <div className="p-4 pb-0">
                <EventImageSection 
                  event={event} 
                  isCreator={isCreator} 
                  refreshEvents={refreshEvents} 
                />
              </div>

              {/* Event details information */}
              <div className="p-4 pb-2">
                <EventDetailsInfo 
                  event={event}
                  isCreator={isCreator}
                  isParticipating={isParticipating}
                  isProcessing={isProcessing}
                  onParticipate={onParticipate}
                  refreshEvents={refreshEvents}
                />
              </div>

              {/* Participation Form Section */}
              <div className="px-4 pb-2">
                <EventParticipationFormSection event={event} />
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

              {/* Event actions section (for creators) */}
              <EventActionsSection
                event={event}
                isCreator={isCreator}
                onDeleteEvent={onDeleteEvent}
              />
            </div>
          </ScrollArea>
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
    </>
  );
}
