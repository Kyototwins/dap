
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventComment } from "@/types/events";

interface EventCommentsProps {
  comments: EventComment[];
}

export function EventComments({ comments }: EventCommentsProps) {
  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-center text-gray-500 py-4">コメントはまだありません</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <img
                src={comment.user?.avatar_url || "/placeholder.svg"}
                alt={`${comment.user?.first_name}のアバター`}
              />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {comment.user?.first_name} {comment.user?.last_name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDateTime(comment.created_at)}
                </span>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
