
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { Match } from "@/types/messages";

export function useMessageUrlParams(
  matches: Match[], 
  handleSelectMatch: (match: Match) => Promise<void>
) {
  const [searchParams] = useSearchParams();
  const [userIdProcessed, setUserIdProcessed] = useState<string | null>(null);
  const processingRef = useRef(false);
  
  // Check for user query parameter
  useEffect(() => {
    const userId = searchParams.get('user');
    
    // Skip if no userId, we're already processing, or we already processed this specific userId
    if (!userId || processingRef.current || userId === userIdProcessed) {
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
        // Prevent concurrent processing
        processingRef.current = true;
        
        console.log(`Found match with user ${userId}, selecting it`);
        setUserIdProcessed(userId); // Mark this user ID as processed to prevent loops
        
        // Select the match
        handleSelectMatch(matchWithUser)
          .then(() => {
            console.log(`Successfully selected match with user ${userId}`);
          })
          .catch(err => {
            console.error("Error selecting match:", err);
          })
          .finally(() => {
            processingRef.current = false;
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
