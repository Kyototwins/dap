
import { useState, useEffect } from "react";
import { Send, Expand, Edit, Check, X, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Event, EventComment } from "@/types/events";
import { EventComments } from "./EventComments";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Check as CheckIcon } from "lucide-react";

interface EventDetailsDialogProps {
  event: Event | null;
  comments: EventComment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  onSubmitComment: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshEvents?: () => void;
  onDeleteEvent: (eventId: string) => void;
  isParticipating: boolean;
  onParticipate: (eventId: string, eventTitle: string) => void;
  isProcessing: boolean;
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
  refreshEvents,
  onDeleteEvent,
  isParticipating,
  onParticipate,
  isProcessing
}: EventDetailsDialogProps) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [commentsFullscreen, setCommentsFullscreen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const displayCategory = categoryTranslationMap[event.category] || event.category;
  const eventDate = new Date(event.date);
  const currentDate = new Date();
  const isPastEvent = eventDate < currentDate;

  // Calculate if event is disabled for participation
  const isDisabled = isProcessing || 
    isPastEvent || 
    (!isParticipating && event.max_participants !== 0 && event.current_participants >= event.max_participants);
  
  // Determine participation button state
  let participateButtonText = "イベントに参加する";
  let participateButtonClasses = "bg-[#7f1184] hover:bg-[#671073] text-white";
  let participateButtonIcon = <Plus className="w-4 h-4 mr-1" />;
  
  if (isProcessing) {
    participateButtonText = isParticipating ? "キャンセル中..." : "参加中...";
    participateButtonClasses = "bg-gray-300 text-gray-600 cursor-wait";
    participateButtonIcon = <Loader2 className="w-4 h-4 mr-1 animate-spin" />;
  } else if (isParticipating) {
    participateButtonText = "参加をキャンセルする";
    participateButtonClasses = "bg-gray-200 hover:bg-gray-300 text-gray-700";
    participateButtonIcon = <CheckIcon className="w-4 h-4 mr-1" />;
  } else if (isPastEvent) {
    participateButtonText = "イベント終了";
    participateButtonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed";
    participateButtonIcon = null;
  } else if (event.max_participants !== 0 && event.current_participants >= event.max_participants) {
    participateButtonText = "満員";
    participateButtonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed";
    participateButtonIcon = null;
  }
  
  // Save description function
  const saveDescription = async () => {
    if (!event) return;
    
    try {
      const { error } = await supabase
        .from("events")
        .update({ description: editedDescription })
        .eq("id", event.id);
      
      if (error) throw error;
      
      toast({
        title: "説明が更新されました",
        description: "イベントの説明が更新されました。"
      });
      
      setIsEditingDescription(false);
      // Refresh events if provided
      if (refreshEvents) refreshEvents();
      
    } catch (error: any) {
      toast({
        title: "説明の更新に失敗しました",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteButtonClick = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDeleteEvent(event.id);
    setDeleteDialogOpen(false);
    onOpenChange(false); // Close the main dialog
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
                  参加者: {event.max_participants === 0 
                    ? `${event.current_participants}/∞` 
                    : `${event.current_participants}/${event.max_participants}`}
                </div>
              </div>

              {/* Participation button */}
              <Button
                className={`w-full rounded-xl ${participateButtonClasses}`}
                disabled={isDisabled}
                onClick={() => onParticipate(event.id, event.title)}
              >
                {participateButtonIcon}
                {participateButtonText}
              </Button>
            </div>
            
            {/* Event description - with edit capability for creators */}
            <div className="px-4 pb-4">
              <div className="flex justify-between items-center mb-1">
                <div className="font-semibold text-gray-700">説明</div>
                {isCreator && (
                  <div className="flex gap-2">
                    {!isEditingDescription && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setIsEditingDescription(true)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        編集
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-red-500 hover:text-red-700"
                      onClick={handleDeleteButtonClick}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      削除
                    </Button>
                  </div>
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
                      キャンセル
                    </Button>
                    <Button 
                      size="sm"
                      onClick={saveDescription}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      保存
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
                <h3 className="font-medium">コメント</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="hover:bg-doshisha-purple hover:text-white"
                  onClick={() => setCommentsFullscreen(true)}
                  aria-label="全画面表示"
                >
                  <Expand className="h-4 w-4" />
                </Button>
              </div>
              {/* Show comments */}
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
              コメント: <span className="truncate max-w-xs">{event.title}</span>
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
                placeholder="コメントを入力..."
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

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>イベントを削除</AlertDialogTitle>
            <AlertDialogDescription>
              このイベントを本当に削除しますか？この操作は元に戻せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
