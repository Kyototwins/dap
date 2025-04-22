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
      setLoading(true);
      console.log("Fetching matches...");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("User not authenticated");
        throw new Error("Not authenticated");
      }

      console.log("Authenticated user ID:", user.id);

      // Get matches where user is either user1 or user2 AND status is accepted
      const { data: matchesData, error } = await supabase
        .from("matches")
        .select(`
          id,
          user1_id,
          user2_id,
          status,
          created_at,
          user1:profiles!matches_user1_id_fkey (*),
          user2:profiles!matches_user2_id_fkey (*)
        `)
        .eq("status", "accepted")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) {
        console.error("Database error fetching matches:", error);
        throw error;
      }
      
      console.log(`Found ${matchesData?.length || 0} raw matches for user ${user.id}`);
      if (matchesData && matchesData.length > 0) {
        console.log("Sample raw match data:", matchesData[0]);
      }

      // Get latest message and unread count for each match
      const processedMatches = await Promise.all((matchesData || []).map(async (match) => {
        const otherUser = match.user1_id === user.id ? match.user2 : match.user1;
        if (!otherUser) {
          console.error(`Missing other user data for match ${match.id}`);
          return null;
        }
        
        console.log(`Processing match ${match.id} with other user:`, otherUser.id);
        
        // Fetch the most recent message for this match
        const { data: latestMessages, error: messagesError } = await supabase
          .from("messages")
          .select("content, created_at, sender_id")
          .eq("match_id", match.id)
          .order("created_at", { ascending: false })
          .limit(1);
          
        if (messagesError) {
          console.error("Error fetching messages for match:", match.id, messagesError);
        }
        
        const lastMessage = latestMessages && latestMessages.length > 0 ? latestMessages[0] : null;
        console.log(`Match ${match.id} last message:`, lastMessage || "No messages");
        
        // Count unread messages
        let unreadCount = 0;
        if (lastMessage && lastMessage.sender_id === otherUser.id) {
          // For now just mark as 1 if the last message is from other user
          // In a real app, you would count all unread messages
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
          // If it's already an object, safely convert it to Record<string, number>
          else if (typeof otherUser.language_levels === 'object') {
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
          id: match.id,
          status: match.status,
          user1_id: match.user1_id,
          user2_id: match.user2_id,
          otherUser: {
            id: otherUser.id,
            first_name: otherUser.first_name || 'ユーザー',
            last_name: otherUser.last_name || '',
            avatar_url: otherUser.avatar_url,
            about_me: otherUser.about_me,
            age: otherUser.age,
            gender: otherUser.gender,
            ideal_date: otherUser.ideal_date,
            image_url_1: otherUser.image_url_1,
            image_url_2: otherUser.image_url_2,
            life_goal: otherUser.life_goal,
            origin: otherUser.origin,
            sexuality: otherUser.sexuality,
            university: otherUser.university,
            department: otherUser.department || '',
            year: otherUser.year || '',
            hobbies: otherUser.hobbies || [],
            languages: otherUser.languages || [],
            language_levels: processedLanguageLevels,
            superpower: otherUser.superpower || '',
            learning_languages: otherUser.learning_languages || [],
            created_at: otherUser.created_at,
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
        } as Match;
      }));

      // Filter out any null matches (from processing errors)
      const validMatches = processedMatches.filter(match => match !== null) as Match[];

      // Sort matches by the last message's created_at timestamp (most recent first)
      const sortedMatches = validMatches.sort((a, b) => {
        const timeA = a.lastMessage?.created_at ? new Date(a.lastMessage.created_at).getTime() : 0;
        const timeB = b.lastMessage?.created_at ? new Date(b.lastMessage.created_at).getTime() : 0;
        return timeB - timeA; // Most recent first
      });

      console.log(`Processed ${sortedMatches.length} valid matches`);
      setMatches(sortedMatches);
    } catch (error: any) {
      console.error("Error fetching matches:", error);
      toast({
        title: "エラー",
        description: error.message || "マッチの取得に失敗しました",
        variant: "destructive",
      });
      // Set empty matches rather than keeping loading state forever
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    matches,
    loading,
    fetchMatches
  };
}
