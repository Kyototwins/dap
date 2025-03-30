
import { Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/date-utils";
import { Event } from "./EventCard";
import { EventComment, EventComments } from "./EventComments";

interface EventDetailsDialogProps {
  event: Event | null;
  comments: EventComment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  onSubmitComment: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailsDialog({
  event,
  comments,
  newComment,
  setNewComment,
  onSubmitComment,
  open,
  onOpenChange
}: EventDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{event?.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-hidden">
          <div className="flex-shrink-0">
            <img
              src={event?.image_url || "/placeholder.svg"}
              alt={event?.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <p className="mt-4 text-gray-600">{event?.description}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              <Badge variant="outline">{event?.category}</Badge>
              <span className="text-sm text-gray-600">
                {event?.location}
              </span>
              <span className="text-sm text-gray-600">
                {event && formatDate(event.date)}
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            <h3 className="font-semibold mb-4">コメント</h3>
            <div className="flex-1 min-h-0">
              <EventComments comments={comments} />
            </div>

            <div className="flex gap-2 items-start mt-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="コメントを入力..."
                className="flex-1"
                rows={2}
              />
              <Button
                onClick={onSubmitComment}
                disabled={!newComment.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
