
import { Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/date-utils";
import { Event, EventComment } from "@/types/events";
import { EventComments } from "./EventComments";

interface EventDetailsDialogProps {
  event: Event | null;
  comments: EventComment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  onSubmitComment: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  onOpenChange
}: EventDetailsDialogProps) {
  if (!event) return null;
  
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const displayCategory = categoryTranslationMap[event.category] || event.category;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[95vh] h-[95vh] flex flex-col p-0 overflow-hidden">
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
                {displayCategory}
              </Badge>
              <div className="text-sm text-gray-600">
                Participants: {event.current_participants}/{event.max_participants}
              </div>
            </div>
          </div>
          {/* イベント説明は必ず外に独立して見えるように、下に移動 */}
          <div className="px-4 pb-2">
            <div className="font-semibold text-gray-700 mb-1">Description</div>
            <div
              className="text-gray-700 text-sm bg-gray-100 rounded p-3 max-h-32 overflow-y-auto"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {event.description}
            </div>
          </div>
          {/* コメントセクション */}
          <div className="flex-1 min-h-0 flex flex-col bg-gray-50 p-4 pt-2">
            <h3 className="font-medium mb-3">Comments</h3>
            <div className="flex-1 min-h-0 overflow-y-auto mb-4">
              <EventComments comments={comments} />
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
                className="bg-doshisha-purple hover:bg-doshisha-darkPurple h-10 w-10"
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
