
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EventCard, Event } from "@/components/events/EventCard";
import { EventComment } from "@/components/events/EventComments";
import { EventDetailsDialog } from "@/components/events/EventDetailsDialog";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventFilters, TimeFilter, CategoryFilter } from "@/components/events/EventFilters";
import { isToday, isThisWeek, isThisMonth } from "@/lib/date-utils";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [comments, setComments] = useState<EventComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [participations, setParticipations] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
    fetchUserParticipations();
  }, []);

  useEffect(() => {
    // Apply filters to events
    let result = [...events];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }
    
    // Apply time filter
    if (timeFilter !== "all") {
      result = result.filter(event => {
        if (timeFilter === "today") return isToday(event.date);
        if (timeFilter === "this-week") return isThisWeek(event.date);
        if (timeFilter === "this-month") return isThisMonth(event.date);
        return true;
      });
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      const categoryMap: Record<CategoryFilter, string> = {
        "all": "",
        "language-exchange": "言語交換",
        "cultural": "文化体験",
        "academic": "学術",
        "social": "交流会",
        "tour": "ツアー"
      };
      
      if (categoryMap[categoryFilter]) {
        result = result.filter(event => event.category === categoryMap[categoryFilter]);
      }
    }
    
    setFilteredEvents(result);
  }, [events, searchQuery, timeFilter, categoryFilter]);

  useEffect(() => {
    if (selectedEvent) {
      fetchComments(selectedEvent.id);
      
      // リアルタイムサブスクリプションを設定
      const channel = supabase
        .channel('event-comments')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'event_comments',
            filter: `event_id=eq.${selectedEvent.id}`
          },
          async (payload) => {
            console.log('New comment received:', payload);
            // 新しいコメントを取得
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
              .eq('id', payload.new.id)
              .single();

            if (error) {
              console.error('Error fetching new comment:', error);
              return;
            }

            if (data) {
              setComments(prev => [...prev, data]);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
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
      setFilteredEvents(data || []);
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

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-8">読み込み中...</div>;
    }

    if (filteredEvents.length === 0) {
      return (
        <div className="text-center py-8 space-y-4">
          <p className="text-gray-500">
            {searchQuery || timeFilter !== "all" || categoryFilter !== "all"
              ? "条件に合うイベントが見つかりませんでした"
              : "現在開催予定のイベントはありません"}
          </p>
          <Button onClick={() => navigate("/events/new")}>
            <Plus className="w-4 h-4 mr-2" />
            イベントを作成
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isParticipating={!!participations[event.id]}
            onJoin={handleJoinEvent}
            onCardClick={setSelectedEvent}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <EventsHeader
        unreadNotifications={0}
        onSearchChange={setSearchQuery}
      />
      
      <EventFilters
        timeFilter={timeFilter}
        categoryFilter={categoryFilter}
        onTimeFilterChange={setTimeFilter}
        onCategoryFilterChange={setCategoryFilter}
      />

      {renderContent()}

      <EventDetailsDialog
        event={selectedEvent}
        comments={comments}
        newComment={newComment}
        setNewComment={setNewComment}
        onSubmitComment={handleSubmitComment}
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      />
    </div>
  );
}
