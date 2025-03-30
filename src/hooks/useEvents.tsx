
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/components/events/EventCard";
import { isToday, isThisWeek, isThisMonth } from "@/lib/date-utils";
import { EventComment } from "@/components/events/EventComments";
import { TimeFilter, CategoryFilter } from "@/components/events/EventFilters";

export function useEvents() {
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

  return {
    events,
    filteredEvents,
    selectedEvent,
    setSelectedEvent,
    comments,
    newComment,
    setNewComment,
    participations,
    loading,
    searchQuery,
    setSearchQuery,
    timeFilter,
    setTimeFilter,
    categoryFilter,
    setCategoryFilter,
    handleSubmitComment,
    fetchComments,
    fetchEvents,
    fetchUserParticipations
  };
}
