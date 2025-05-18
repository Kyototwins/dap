import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Match } from "@/types/messages";
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
      const mockMatches = [
        {
          id: "mock-match-1",
          user1_id: "mock-user-id",
          user2_id: "mock-match-user-1",
          created_at: new Date().toISOString(),
          status: "active",
          user1_last_read: new Date().toISOString(),
          user2_last_read: new Date().toISOString(),
          user1: {
            id: "mock-user-id",
            created_at: new Date().toISOString(),
            first_name: "太郎",
            last_name: "同志社",
            avatar_url: "/lovable-uploads/dcec855f-513e-4a70-aae4-fa4c16529c99.png",
          },
          user2: {
            id: "mock-match-user-1",
            created_at: new Date().toISOString(),
            first_name: "花子",
            last_name: "京都",
            avatar_url: "/lovable-uploads/dd8c0f48-e885-4658-8781-f1fb6bde0fd3.png",
          },
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
          user1: {
            id: "mock-user-id",
            created_at: new Date().toISOString(),
            first_name: "太郎",
            last_name: "同志社",
            avatar_url: "/lovable-uploads/dcec855f-513e-4a70-aae4-fa4c16529c99.png",
          },
          user2: {
            id: "mock-match-user-2",
            created_at: new Date().toISOString(),
            first_name: "John",
            last_name: "Smith",
            avatar_url: "/lovable-uploads/9797c959-5651-45e5-b6fc-2d1ff0c0b223.png",
          },
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
      setMatches(mockMatches as Match[]);
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
