
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Match } from "@/types/messages";

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      const { data: matchesData, error } = await supabase
        .from("matches")
        .select(`
          *,
          user1:profiles!matches_user1_id_fkey (id, first_name, last_name, avatar_url, about_me, age, gender, ideal_date, image_url_1, image_url_2, life_goal, origin, sexuality, superpower, university, created_at),
          user2:profiles!matches_user2_id_fkey (id, first_name, last_name, avatar_url, about_me, age, gender, ideal_date, image_url_1, image_url_2, life_goal, origin, sexuality, superpower, university, created_at)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get latest message and unread count for each match
      const processedMatches = await Promise.all(matchesData.map(async (match) => {
        const otherUser = match.user1_id === user.id ? match.user2 : match.user1;
        
        // Fetch the most recent message for this match
        const { data: latestMessages, error: messagesError } = await supabase
          .from("messages")
          .select("content, created_at, sender_id")
          .eq("match_id", match.id)
          .order("created_at", { ascending: false })
          .limit(1);
          
        if (messagesError) {
          console.error("Error fetching messages:", messagesError);
        }
        
        const lastMessage = latestMessages && latestMessages.length > 0 ? latestMessages[0] : null;
        
        // Count unread messages (messages from the other user that the current user hasn't read)
        // For now we'll just check if the latest message is from the other user
        // In a real app, you'd track read status in the database
        let unreadCount = 0;
        if (lastMessage && lastMessage.sender_id === otherUser.id) {
          // This is a simplified version - in a real app, you would have a proper "read" status in the database
          // Here we're just assuming the latest message from the other user might be unread
          // You can replace this with actual read tracking logic
          unreadCount = 1;
        }
        
        return {
          ...match,
          otherUser: {
            ...otherUser,
            department: '',
            year: '',
            hobbies: [],
            languages: [],
            language_levels: {},
            superpower: otherUser.superpower || '',
            learning_languages: [],
          },
          lastMessage: lastMessage,
          unreadCount: unreadCount
        };
      }));

      // Sort matches by the last message's created_at timestamp (most recent first)
      const sortedMatches = processedMatches.sort((a, b) => {
        const timeA = a.lastMessage?.created_at ? new Date(a.lastMessage.created_at).getTime() : 0;
        const timeB = b.lastMessage?.created_at ? new Date(b.lastMessage.created_at).getTime() : 0;
        return timeB - timeA; // Most recent first
      });

      setMatches(sortedMatches);
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return {
    matches,
    loading,
    fetchMatches
  };
}
