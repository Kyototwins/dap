import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Match } from "@/types/messages";
import { fetchUserMatches, processMatch } from "@/services/matchService";

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
      
      const { matchesData, userId } = await fetchUserMatches();
      console.log(`Total matches available: ${matchesData?.length || 0}`);
      
      if ((matchesData || []).length > 0) {
        console.log("Sample match data:", matchesData[0]);
      } else {
        console.log("No matches found");
      }

      // Process each match to get latest message and other details
      const processedMatches = await Promise.all((matchesData || []).map(match => 
        processMatch(match, userId)
      ));

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
