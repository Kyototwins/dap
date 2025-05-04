
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Event, EventComment } from "@/types/events";
import { TimeFilter, CategoryFilter } from "@/components/events/EventFilters";
import { filterEvents } from "@/utils/eventFilters";
import { fetchEventComments, submitEventComment } from "@/services/eventCommentService";
import { fetchEvents, fetchUserParticipations } from "@/services/eventDataService";
import { SortOption } from "@/components/events/EventSortOptions";

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
  const [sortOption, setSortOption] = useState<SortOption>("date_asc");
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Apply filters to events
    const filtered = filterEvents(events, searchQuery, timeFilter, categoryFilter);
    
    // Apply sorting
    const sorted = sortEvents(filtered, sortOption);
    
    // Remove events over a month old
    const current = new Date();
    const filteredByAge = sorted.filter(event => {
      const eventDate = new Date(event.date);
      const isPastEvent = eventDate < current;
      const isOlderThanMonth = isPastEvent && 
        (current.getTime() - eventDate.getTime()) > (30 * 24 * 60 * 60 * 1000);
      return !isOlderThanMonth;
    });
    
    setFilteredEvents(filteredByAge);
  }, [events, searchQuery, timeFilter, categoryFilter, sortOption]);

  const sortEvents = (eventsList: Event[], sort: SortOption): Event[] => {
    const sortedEvents = [...eventsList];
    
    switch (sort) {
      case 'newest':
        return sortedEvents.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'popular':
        return sortedEvents.sort((a, b) => 
          b.current_participants - a.current_participants
        );
      case 'date_asc':
        return sortedEvents.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      default:
        return sortedEvents;
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      loadEventComments(selectedEvent.id);
      setupCommentSubscription(selectedEvent.id);
    }
  }, [selectedEvent]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [eventsData, participationsData] = await Promise.all([
        fetchEvents(),
        fetchUserParticipations()
      ]);
      
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      setParticipations(participationsData);
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

  const loadEventComments = async (eventId: string) => {
    try {
      const commentsData = await fetchEventComments(eventId);
      setComments(commentsData);
    } catch (error: any) {
      toast({
        title: "コメントの取得に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const setupCommentSubscription = (eventId: string) => {
    const channel = supabase
      .channel('event-comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'event_comments',
          filter: `event_id=eq.${eventId}`
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
  };

  const handleSubmitComment = async () => {
    if (!selectedEvent || !newComment.trim()) return;

    try {
      await submitEventComment(selectedEvent.id, newComment);
      setNewComment("");
      
      toast({
        title: "コメントを投稿しました",
      });
    } catch (error: any) {
      toast({
        title: "コメントの投稿に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const refreshEvents = async () => {
    try {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    } catch (error: any) {
      toast({
        title: "イベントの更新に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const refreshParticipations = async () => {
    try {
      const participationsData = await fetchUserParticipations();
      setParticipations(participationsData);
    } catch (error: any) {
      console.error("参加状況の更新に失敗しました:", error);
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
    sortOption,
    setSortOption,
    handleSubmitComment,
    fetchEvents: refreshEvents,
    fetchUserParticipations: refreshParticipations
  };
}
