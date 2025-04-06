
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
      if (!user) throw new Error("Not authenticated");

      const { data: matchesData, error } = await supabase
        .from("matches")
        .select(`
          *,
          user1:profiles!matches_user1_id_fkey (*),
          user2:profiles!matches_user2_id_fkey (*)
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
        
        // Count unread messages
        let unreadCount = 0;
        if (lastMessage && lastMessage.sender_id === otherUser.id) {
          unreadCount = 1;
        }
        
        // Process language_levels to ensure it's the correct type
        let processedLanguageLevels: Record<string, number> = {};
        if (otherUser.language_levels) {
          // If it's a string, try to parse it
          if (typeof otherUser.language_levels === 'string') {
            try {
              processedLanguageLevels = JSON.parse(otherUser.language_levels);
            } catch (e) {
              console.error("Error parsing language_levels:", e);
            }
          } 
          // If it's already an object, cast it to the right type
          else if (typeof otherUser.language_levels === 'object') {
            // Convert any non-number values to numbers where possible
            Object.entries(otherUser.language_levels).forEach(([key, value]) => {
              if (typeof value === 'number') {
                processedLanguageLevels[key] = value;
              } else if (typeof value === 'string' && !isNaN(Number(value))) {
                processedLanguageLevels[key] = Number(value);
              }
            });
          }
        }
        
        return {
          ...match,
          otherUser: {
            ...otherUser,
            department: otherUser.department || '',
            year: otherUser.year || '',
            hobbies: otherUser.hobbies || [],
            languages: otherUser.languages || [],
            language_levels: processedLanguageLevels,
            superpower: otherUser.superpower || '',
            learning_languages: otherUser.learning_languages || [],
            photo_comment: otherUser.photo_comment || null,
            worst_nightmare: otherUser.worst_nightmare || null,
            friend_activity: otherUser.friend_activity || null,
            best_quality: otherUser.best_quality || null
          },
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            created_at: lastMessage.created_at
          } : undefined,
          unreadCount: unreadCount
        } as Match;  // Explicitly cast to Match type
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
        title: "Error",
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
