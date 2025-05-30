
import { Event, EventComment } from "@/types/events";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import { EventComments } from "../EventComments";

interface EventCommentsFullscreenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  comments: EventComment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  onSubmitComment: () => void;
}

export function EventCommentsFullscreenDialog({
  open,
  onOpenChange,
  event,
  comments,
  newComment,
  setNewComment,
  onSubmitComment
}: EventCommentsFullscreenDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full h-[95vh] sm:h-[90vh] flex flex-col p-0 overflow-hidden m-2 sm:m-6">
        <DialogHeader className="p-3 sm:p-4 border-b flex flex-row items-center justify-between flex-shrink-0 min-h-[60px]">
          <DialogTitle className="text-base sm:text-lg flex items-center gap-2 flex-1 min-w-0 pr-2">
            <span className="hidden sm:inline">Comments for:</span>
            <span className="sm:hidden">Comments:</span>
            <span className="truncate">{event.title}</span>
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 sm:h-6 sm:w-6 p-0 flex-shrink-0"
          >
            <X className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        </DialogHeader>
        <div className="flex flex-1 flex-col bg-gray-50 py-3 px-3 sm:py-4 sm:px-6 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto mb-3 sm:mb-4">
            <EventComments comments={comments} />
          </div>
          <div className="flex gap-2 items-end pt-2 border-t">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter a comment..."
              className="flex-1 min-h-[60px] sm:min-h-[80px] max-h-32 sm:max-h-56 resize-none bg-white text-sm sm:text-base"
              rows={2}
            />
            <Button
              onClick={onSubmitComment}
              disabled={!newComment.trim()}
              size="icon"
              className="bg-primary hover:bg-primary/90 text-white h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
