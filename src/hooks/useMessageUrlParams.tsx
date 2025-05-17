
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
    
    // Skip if no userId or we already processed this specific userId
    if (!userId || userId === userIdProcessed) {
      return;
    }
    
    // Only process if we have matches data
    if (matches.length > 0) {
      console.log(`Looking for match with user ${userId} among ${matches.length} matches`);
      
      // Find match with specified user
      const matchWithUser = matches.find(match => 
        match.otherUser.id === userId
      );
      
      if (matchWithUser) {
        console.log(`Found match with user ${userId}, selecting it`);
        setUserIdProcessed(userId); // Mark this user ID as processed to prevent loops
        handleSelectMatch(matchWithUser).catch(err => {
          console.error("Error selecting match:", err);
        });
      } else {
        console.log(`No match found with user ${userId}`);
        // Still mark this userId as processed to prevent repeated attempts
        setUserIdProcessed(userId);
      }
    }
  }, [matches, searchParams, handleSelectMatch, userIdProcessed]);
  
  return {
    userIdProcessed
  };
}
