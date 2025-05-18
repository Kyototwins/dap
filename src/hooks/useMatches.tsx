
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Match, Profile } from "@/types/messages";
import { fetchUserMatches, processMatch } from "@/services/matchService";

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const isLoadingRef = useRef(false);
  const initialFetchDoneRef = useRef(false);

  // Use memoized version for better reference stability
  const fetchMatches = useCallback(async () => {
    // Prevent concurrent fetches
    if (isLoadingRef.current) {
      console.log("Already fetching matches, skipping duplicate request");
      return;
    }

    try {
      isLoadingRef.current = true;
      setLoading(true);
      console.log("Fetching matches...");
      
      // モックデータの作成
      const mockOtherUser1: Profile = {
        id: "mock-match-user-1",
        created_at: new Date().toISOString(),
        first_name: "花子",
        last_name: "京都",
        avatar_url: "/lovable-uploads/dd8c0f48-e885-4658-8781-f1fb6bde0fd3.png",
        age: 23,
        gender: "female",
        origin: "japan",
        about_me: "京都大学の学生です。外国語に興味があります。",
        university: "京都大学",
        department: "国際学部",
        year: "3年生",
        hobbies: ["読書", "旅行", "カフェ巡り"],
        languages: ["日本語", "英語"],
        language_levels: { "日本語": 5, "英語": 3 },
        learning_languages: ["中国語", "フランス語"],
        sexuality: "straight"
      };
      
      const mockOtherUser2: Profile = {
        id: "mock-match-user-2",
        created_at: new Date().toISOString(),
        first_name: "John",
        last_name: "Smith",
        avatar_url: "/lovable-uploads/9797c959-5651-45e5-b6fc-2d1ff0c0b223.png",
        age: 25,
        gender: "male",
        origin: "usa",
        about_me: "Exchange student from the US. Looking to make friends in Japan!",
        university: "Doshisha University",
        department: "Global Studies",
        year: "Exchange student",
        hobbies: ["hiking", "photography", "learning Japanese"],
        languages: ["English", "Spanish"],
        language_levels: { "English": 5, "Spanish": 4, "日本語": 2 },
        learning_languages: ["日本語"],
        sexuality: "straight"
      };
      
      const mockMatches: Match[] = [
        {
          id: "mock-match-1",
          user1_id: "mock-user-id",
          user2_id: "mock-match-user-1",
          created_at: new Date().toISOString(),
          status: "active",
          user1_last_read: new Date().toISOString(),
          user2_last_read: new Date().toISOString(),
          otherUser: mockOtherUser1,
          lastMessage: {
            id: "mock-msg-1",
            content: "こんにちは！よろしくお願いします。",
            created_at: new Date().toISOString(),
            match_id: "mock-match-1",
            sender_id: "mock-match-user-1",
          },
          unreadCount: 0,
        },
        {
          id: "mock-match-2",
          user1_id: "mock-user-id",
          user2_id: "mock-match-user-2",
          created_at: new Date().toISOString(),
          status: "active",
          user1_last_read: new Date().toISOString(),
          user2_last_read: new Date().toISOString(),
          otherUser: mockOtherUser2,
          lastMessage: {
            id: "mock-msg-2",
            content: "Hi there! Nice to meet you.",
            created_at: new Date().toISOString(),
            match_id: "mock-match-2",
            sender_id: "mock-user-id",
          },
          unreadCount: 0,
        }
      ];
      
      console.log(`Generated ${mockMatches.length} mock matches`);
      setMatches(mockMatches);
      initialFetchDoneRef.current = true;
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
      isLoadingRef.current = false;
    }
  }, [toast]);

  // Initial fetch effect
  useEffect(() => {
    if (!initialFetchDoneRef.current) {
      fetchMatches();
    }
  }, [fetchMatches]);

  return {
    matches,
    loading,
    fetchMatches
  };
}
