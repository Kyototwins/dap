
import { useEffect, useState } from "react";
import { Plus, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  location: string;
  date: string;
  max_participants: number;
  current_participants: number;
  creator_id: string;
  category: string;
  creator?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [participations, setParticipations] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
    fetchUserParticipations();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchComments(selectedEvent.id);
    }
  }, [selectedEvent]);

  const fetchComments = async (eventId: string) => {
    try {
      console.log('Fetching comments for event:', eventId);
      const { data, error } = await supabase
        .from('event_comments')
        .select(`
          id,
          content,
          created_at,
          event_id,
          user_id,
          user:profiles!event_comments_user_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        throw error;
      }

      console.log('Fetched comments:', data);
      setComments(data || []);
    } catch (error: any) {
      console.error('Error in fetchComments:', error);
      toast({
        title: "コメントの取得に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmitComment = async () => {
    if (!selectedEvent || !newComment.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      console.log('Submitting comment for event:', selectedEvent.id);
      const { error } = await supabase
        .from('event_comments')
        .insert({
          event_id: selectedEvent.id,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) {
        console.error('Error submitting comment:', error);
        throw error;
      }

      console.log('Comment submitted successfully');
      await fetchComments(selectedEvent.id);
      setNewComment("");
      
      toast({
        title: "コメントを投稿しました",
      });
    } catch (error: any) {
      console.error('Error in handleSubmitComment:', error);
      toast({
        title: "コメントの投稿に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          creator:profiles!creator_id(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq("status", "active")
        .order("date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserParticipations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("event_participants")
        .select("event_id")
        .eq("user_id", user.id);

      if (error) throw error;

      const participationsMap = (data || []).reduce((acc: {[key: string]: boolean}, participation) => {
        acc[participation.event_id] = true;
        return acc;
      }, {});

      setParticipations(participationsMap);
    } catch (error: any) {
      console.error("参加状況の取得に失敗しました:", error);
    }
  };

  const createMessageGroup = async (eventId: string, eventTitle: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("認証されていません");

    const { data: groupData, error: groupError } = await supabase
      .from("message_groups")
      .insert([
        {
          name: eventTitle,
          event_id: eventId
        }
      ])
      .select()
      .single();

    if (groupError) throw groupError;

    const { error: memberError } = await supabase
      .from("message_group_members")
      .insert([
        {
          group_id: groupData.id,
          user_id: user.id
        }
      ]);

    if (memberError) throw memberError;

    return groupData;
  };

  const handleJoinEvent = async (eventId: string, eventTitle: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      const { error: participationError } = await supabase
        .from("event_participants")
        .insert([
          {
            event_id: eventId,
            user_id: user.id,
          },
        ]);

      if (participationError) throw participationError;

      const { error: updateError } = await supabase
        .from("events")
        .update({ current_participants: events.find(e => e.id === eventId)?.current_participants + 1 })
        .eq("id", eventId);

      if (updateError) throw updateError;

      await createMessageGroup(eventId, eventTitle);

      setParticipations(prev => ({
        ...prev,
        [eventId]: true
      }));

      fetchEvents();

      toast({
        title: "イベントに参加しました",
        description: "イベントに参加登録が完了しました。グループメッセージにも参加しました。",
      });
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">イベント一覧</h1>
        <Button size="sm" onClick={() => navigate("/events/new")}>
          <Plus className="w-4 h-4 mr-2" />
          イベントを作成
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">読み込み中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card 
              key={event.id} 
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="relative aspect-video">
                <img
                  src={event.image_url || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <img
                      src={event.creator?.avatar_url || "/placeholder.svg"}
                      alt={`${event.creator?.first_name}のアバター`}
                    />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      主催: {event.creator?.first_name} {event.creator?.last_name}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {event.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{event.category}</Badge>
                    <span className="text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">
                      {event.location}
                    </span>
                    <span className="text-gray-600">
                      参加者: {event.current_participants}/{event.max_participants}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    className="w-full"
                    disabled={event.current_participants >= event.max_participants || participations[event.id]}
                    variant={participations[event.id] ? "secondary" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinEvent(event.id, event.title);
                    }}
                  >
                    {participations[event.id] 
                      ? "参加済み"
                      : event.current_participants >= event.max_participants
                        ? "満員です"
                        : "参加する"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          現在開催予定のイベントはありません
        </div>
      )}

      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 min-h-0 flex flex-col gap-4">
            <div className="flex-shrink-0">
              <img
                src={selectedEvent?.image_url || "/placeholder.svg"}
                alt={selectedEvent?.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="mt-4 text-gray-600">{selectedEvent?.description}</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                <Badge variant="outline">{selectedEvent?.category}</Badge>
                <span className="text-sm text-gray-600">
                  {selectedEvent?.location}
                </span>
                <span className="text-sm text-gray-600">
                  {selectedEvent && new Date(selectedEvent.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col gap-4 mt-4">
              <h3 className="font-semibold">コメント</h3>
              <ScrollArea className="flex-1 min-h-0 border rounded-lg p-4 h-[300px]">
                <div className="space-y-4">
                  {comments.map((comment) => (
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
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-center text-gray-500">まだコメントはありません</p>
                  )}
                </div>
              </ScrollArea>

              <div className="flex gap-2 items-start">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="コメントを入力..."
                  className="flex-1"
                  rows={2}
                />
                <Button
                  onClick={handleSubmitComment}
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
    </div>
  );
}
