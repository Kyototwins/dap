
import { Send, Expand } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event, EventComment } from "@/types/events";
import { EventComments } from "./EventComments";
import { useState } from "react";

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
  // 追加: 全画面コメントダイアログ用state
  const [commentsFullscreen, setCommentsFullscreen] = useState(false);

  if (!event) return null;
  
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const displayCategory = categoryTranslationMap[event.category] || event.category;

  // 最新のコメント（配列の最後）
  const latestComment = comments.length > 0 ? comments[comments.length - 1] : null;

  return (
    <>
      {/* 通常のイベント詳細ダイアログ */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[95vh] h-[95vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-lg">{event.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* イベント基本情報 */}
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
            
            {/* イベント説明 */}
            <div className="px-4 pb-4">
              <div className="font-semibold text-gray-700 mb-1">Description</div>
              <div
                className="text-gray-700 text-sm bg-gray-100 rounded p-3"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {event.description}
              </div>
            </div>
            
            {/* コメントセクション */}
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
              {/* 最新コメントのみ表示 */}
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
                  // 紫色に（カスタムカラー/primary/hoverも紫で統一）
                  className="bg-primary hover:bg-primary/90 text-white h-10 w-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 全画面コメントダイアログ */}
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
                // 紫色に
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

