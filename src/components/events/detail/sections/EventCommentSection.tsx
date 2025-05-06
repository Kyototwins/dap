
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EventComment } from "@/types/events";
import { Expand, Send } from "lucide-react";
import { EventComments } from "../EventComments";

interface EventCommentSectionProps {
  comments: EventComment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  onSubmitComment: () => void;
  onExpandClick: () => void;
}

export function EventCommentSection({
  comments,
  newComment,
  setNewComment,
  onSubmitComment,
  onExpandClick
}: EventCommentSectionProps) {
  // Get the latest comment
  const latestComments = comments.length > 0 ? comments.slice(-3) : [];

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-50 p-4 pt-2">
      <div className="flex items-center mb-3 justify-between">
        <h3 className="font-medium">Comments</h3>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hover:bg-doshisha-purple hover:text-white"
          onClick={onExpandClick}
          aria-label="Show fullscreen"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Show recent comments */}
      <div className="flex-1 min-h-0 overflow-y-auto mb-4">
        {latestComments.length > 0 ? (
          <EventComments comments={latestComments} />
        ) : (
          <p className="text-center text-gray-500 py-4">No comments yet</p>
        )}
        
        {comments.length > 3 && (
          <Button 
            variant="link" 
            className="w-full mt-2 text-sm text-gray-600" 
            onClick={onExpandClick}
          >
            View all comments ({comments.length})
          </Button>
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
  );
}
