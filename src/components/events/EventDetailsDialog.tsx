
import { Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/date-utils";
import { Event } from "./EventList";
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
  if (!event) return null;
  
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg">{event.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
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
                {event.category}
              </Badge>
              
              <div className="text-sm text-gray-600">
                参加者: {event.current_participants}/{event.max_participants}
              </div>
            </div>
            
            <p className="text-gray-700">{event.description}</p>
          </div>

          <div className="flex-1 min-h-0 flex flex-col bg-gray-50 p-4">
            <h3 className="font-medium mb-3">コメント</h3>
            <div className="flex-1 min-h-0 overflow-y-auto mb-4">
              <EventComments comments={comments} />
            </div>

            <div className="flex gap-2 items-end pt-2 border-t">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="コメントを入力..."
                className="flex-1 min-h-[60px] max-h-[120px] resize-none bg-white"
                rows={2}
              />
              <Button
                onClick={onSubmitComment}
                disabled={!newComment.trim()}
                size="icon"
                className="bg-amber-500 hover:bg-amber-600 h-10 w-10"
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
