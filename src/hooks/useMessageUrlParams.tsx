
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Match } from "@/types/messages";

export function useMessageUrlParams(
  matches: Match[], 
  handleSelectMatch: (match: Match) => Promise<void>
) {
  const [searchParams] = useSearchParams();
  const [userIdProcessed, setUserIdProcessed] = useState<string | null>(null);
  
  // Check for user query parameter
  useEffect(() => {
    const userId = searchParams.get('user');
    
    // Skip if we already processed this user ID to avoid oscillation
    if (userId && userId === userIdProcessed) {
      return;
    }
    
    if (userId && matches.length > 0) {
      // Find match with specified user
      const matchWithUser = matches.find(match => 
        match.otherUser.id === userId
      );
      
      if (matchWithUser) {
        console.log(`Found match with user ${userId}, selecting it`);
        setUserIdProcessed(userId); // Mark this user ID as processed
        handleSelectMatch(matchWithUser);
      }
    }
  }, [matches, searchParams, handleSelectMatch, userIdProcessed]);
  
  return {
    userIdProcessed
  };
}
