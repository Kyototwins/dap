
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Event, EventComment } from "@/types/events";
import { fetchEventComments, submitEventComment } from "@/services/eventCommentService";

export function useEventComments(selectedEvent: Event | null) {
  const [comments, setComments] = useState<EventComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (selectedEvent) {
      loadEventComments(selectedEvent.id);
      const unsubscribe = setupCommentSubscription(selectedEvent.id);
      return unsubscribe;
    }
  }, [selectedEvent]);

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

  const handleSubmitComment = async (eventId: string) => {
    if (!newComment.trim()) return;

    try {
      await submitEventComment(eventId, newComment);
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

  return {
    comments,
    newComment,
    setNewComment,
    handleSubmitComment
  };
}
