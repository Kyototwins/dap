
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
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

interface EventParticipation {
  id: string;
  event_id: string;
  user_id: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [participations, setParticipations] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
    fetchUserParticipations();
  }, []);

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

    // メッセージグループを作成
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

    // グループメンバーとして登録
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

      // イベント参加を記録
      const { error: participationError } = await supabase
        .from("event_participants")
        .insert([
          {
            event_id: eventId,
            user_id: user.id,
          },
        ]);

      if (participationError) throw participationError;

      // 現在の参加者数を更新
      const { error: updateError } = await supabase
        .from("events")
        .update({ current_participants: events.find(e => e.id === eventId)?.current_participants + 1 })
        .eq("id", eventId);

      if (updateError) throw updateError;

      // メッセージグループを作成または参加
      await createMessageGroup(eventId, eventTitle);

      // 状態を更新
      setParticipations(prev => ({
        ...prev,
        [eventId]: true
      }));

      // イベント一覧を更新
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
            <Card key={event.id} className="overflow-hidden">
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
                    onClick={() => handleJoinEvent(event.id, event.title)}
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
    </div>
  );
}
