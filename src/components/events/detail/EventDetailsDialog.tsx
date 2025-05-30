
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Event, EventComment } from "@/types/events";
import { EventDetailsHeader } from "./sections/EventDetailsHeader";
import { EventDetailsInfo } from "./sections/EventDetailsInfo";
import { EventDetailsDescription } from "./sections/EventDetailsDescription";
import { EventCommentSection } from "./sections/EventCommentSection";
import { EventCommentsFullscreenDialog } from "./dialogs/EventCommentsFullscreenDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ImageUpload } from "@/components/profile/ImageUpload";
import { useProfileImageUpload } from "@/hooks/profile/useProfileImageUpload";

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
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageUpload, setImageUpload] = useState({
    file: null as File | null,
    preview: "",
    uploading: false
  });
  const { toast } = useToast();
  const { uploadImage } = useProfileImageUpload();

  useEffect(() => {
    // Check if current user is the creator when event changes
    if (event) {
      setEditedDescription(event.description);
      setImageUpload({
        file: null,
        preview: event.image_url || "",
        uploading: false
      });
      
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUpload({
        file,
        preview: URL.createObjectURL(file),
        uploading: false
      });
    }
  };

  const saveImage = async () => {
    if (!event || !imageUpload.file) return;
    
    try {
      setImageUpload(prev => ({ ...prev, uploading: true }));
      
      const imageUrl = await uploadImage(imageUpload.file, 'events');
      
      const { error } = await supabase
        .from("events")
        .update({ image_url: imageUrl })
        .eq("id", event.id);
      
      if (error) throw error;
      
      toast({
        title: "Image updated",
        description: "Event image has been updated successfully."
      });
      
      setIsEditingImage(false);
      if (refreshEvents) refreshEvents();
      
    } catch (error: any) {
      toast({
        title: "Error updating image",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setImageUpload(prev => ({ ...prev, uploading: false }));
    }
  };

  return (
    <>
      {/* Main event details dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[95vh] h-[95vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
            <DialogTitle className="text-lg">{event.title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* Event image section */}
            <div className="p-4 space-y-4 overflow-y-auto flex-shrink-0 relative">
              {event.image_url && (
                <div className="relative">
                  <img
                    src={imageUpload.preview || event.image_url}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {isCreator && (
                    <div className="absolute top-2 right-2">
                      {!isEditingImage ? (
                        <Button
                          size="sm"
                          onClick={() => setIsEditingImage(true)}
                          className="bg-black/50 hover:bg-black/70 text-white"
                        >
                          Change Image
                        </Button>
                      ) : (
                        <div className="bg-white p-2 rounded-lg shadow-lg space-y-2">
                          <ImageUpload
                            label=""
                            image={imageUpload}
                            onChange={handleImageChange}
                            loading={imageUpload.uploading}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={saveImage}
                              disabled={!imageUpload.file || imageUpload.uploading}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setIsEditingImage(false);
                                setImageUpload({
                                  file: null,
                                  preview: event.image_url || "",
                                  uploading: false
                                });
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Event details information */}
              <EventDetailsInfo 
                event={event}
                isCreator={isCreator}
                isParticipating={isParticipating}
                isProcessing={isProcessing}
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
    </>
  );
}
