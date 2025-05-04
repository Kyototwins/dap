
import { Send, Expand, Edit, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event, EventComment } from "@/types/events";
import { EventComments } from "./EventComments";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface EventDetailsDialogProps {
  event: Event | null;
  comments: EventComment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  onSubmitComment: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshEvents?: () => void;
}

const categoryTranslationMap: Record<string, string> = {
  'スポーツ': 'Sports',
  '勉強': 'Study',
  '食事': 'Meal',
  'カラオケ': 'Karaoke',
  '観光': 'Sightseeing',
  'その他': 'Other',
  // fallback if category is already English or others
  'Sports': 'Sports',
  'Study': 'Study',
  'Meal': 'Meal',
  'Karaoke': 'Karaoke',
  'Sightseeing': 'Sightseeing',
  'Other': 'Other',
};

export function EventDetailsDialog({
  event,
  comments,
  newComment,
  setNewComment,
  onSubmitComment,
  open,
  onOpenChange,
  refreshEvents
}: EventDetailsDialogProps) {
  // Added: editing state for description
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
  
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const displayCategory = categoryTranslationMap[event.category] || event.category;

  // Latest comment (array's last)
  const latestComment = comments.length > 0 ? comments[comments.length - 1] : null;
  
  // Added: save description function
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
        <DialogContent className="max-w-md max-h-[95vh] h-[95vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-lg">{event.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* Event basic info */}
            <div className="p-4 space-y-4 overflow-y-auto flex-shrink-0">
              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{formatEventDate(event.date)}</span>
                  <span>•</span>
                  <span>{event.location}</span>
                </div>
                <Badge variant="outline" className="bg-gray-100">
                  {displayCategory}
                </Badge>
                <div className="text-sm text-gray-600">
                  Participants: {event.max_participants === 0 
                    ? `${event.current_participants}/∞` 
                    : `${event.current_participants}/${event.max_participants}`}
                </div>
              </div>
            </div>
            
            {/* Event description - with edit capability for creators */}
            <div className="px-4 pb-4">
              <div className="flex justify-between items-center mb-1">
                <div className="font-semibold text-gray-700">Description</div>
                {isCreator && !isEditingDescription && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 px-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsEditingDescription(true)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              
              {isEditingDescription ? (
                <div className="space-y-2">
                  <Textarea 
                    value={editedDescription} 
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="min-h-[120px] text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setEditedDescription(event.description);
                        setIsEditingDescription(false);
                      }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      onClick={saveDescription}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="text-gray-700 text-sm bg-gray-100 rounded p-3"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {event.description}
                </div>
              )}
            </div>
            
            {/* Comment section */}
            <div className="flex-1 min-h-0 flex flex-col bg-gray-50 p-4 pt-2">
              <div className="flex items-center mb-3 justify-between">
                <h3 className="font-medium">Comments</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="hover:bg-doshisha-purple hover:text-white"
                  onClick={() => setCommentsFullscreen(true)}
                  aria-label="Full screen comments"
                >
                  <Expand className="h-4 w-4" />
                </Button>
              </div>
              {/* Only latest comment shown */}
              <div className="flex-1 min-h-0 overflow-y-auto mb-4">
                {latestComment ? (
                  <div className="flex gap-3">
                    <img
                      src={latestComment.user?.avatar_url || "/placeholder.svg"}
                      alt={`${latestComment.user?.first_name}'s avatar`}
                      className="h-8 w-8 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {latestComment.user?.first_name} {latestComment.user?.last_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(latestComment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{latestComment.content}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No comments yet</p>
                )}
              </div>
              <div className="flex gap-2 items-end pt-2 border-t">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Enter a comment..."
                  className="flex-1 min-h-[60px] max-h-[120px] resize-none bg-white"
                  rows={2}
                />
                <Button
                  onClick={onSubmitComment}
                  disabled={!newComment.trim()}
                  size="icon"
                  className="bg-primary hover:bg-primary/90 text-white h-10 w-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen comments dialog */}
      <Dialog open={commentsFullscreen} onOpenChange={setCommentsFullscreen}>
        <DialogContent className="max-w-2xl w-full h-[95vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-lg flex items-center gap-2">
              Comments for: <span className="truncate max-w-xs">{event.title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-1 flex-col bg-gray-50 py-4 px-6 overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto mb-4">
              <EventComments comments={comments} />
            </div>
            <div className="flex gap-2 items-end pt-2 border-t">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter a comment..."
                className="flex-1 min-h-[80px] max-h-56 resize-none bg-white"
                rows={3}
              />
              <Button
                onClick={onSubmitComment}
                disabled={!newComment.trim()}
                size="icon"
                className="bg-primary hover:bg-primary/90 text-white h-12 w-12"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
