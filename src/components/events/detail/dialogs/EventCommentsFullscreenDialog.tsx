
import { Event, EventComment } from "@/types/events";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
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
  );
}
