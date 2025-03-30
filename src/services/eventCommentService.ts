
import { supabase } from "@/integrations/supabase/client";
import { EventComment } from "@/types/events";
import { useToast } from "@/components/ui/use-toast";

export async function fetchEventComments(eventId: string): Promise<EventComment[]> {
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
    return data || [];
  } catch (error: any) {
    console.error('Error in fetchEventComments:', error);
    throw error;
  }
}

export async function submitEventComment(eventId: string, content: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("認証されていません");

    console.log('Submitting comment for event:', eventId);
    const { error } = await supabase
      .from('event_comments')
      .insert({
        event_id: eventId,
        user_id: user.id,
        content: content.trim()
      });

    if (error) {
      console.error('Error submitting comment:', error);
      throw error;
    }

    console.log('Comment submitted successfully');
  } catch (error: any) {
    console.error('Error in submitEventComment:', error);
    throw error;
  }
}
