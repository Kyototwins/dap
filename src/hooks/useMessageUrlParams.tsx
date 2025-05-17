
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { Match } from "@/types/messages";

export function useMessageUrlParams(
  matches: Match[], 
  handleSelectMatch: (match: Match) => Promise<void>
) {
  const [searchParams] = useSearchParams();
  const [processedParams, setProcessedParams] = useState<Set<string>>(new Set());
  const processingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  
  // Check for user query parameter
  useEffect(() => {
    const userId = searchParams.get('user');
    
    // Skip if no userId or we're already processing
    if (!userId || processingRef.current) {
      return;
    }
    
    // Skip if we've already processed this userId
    if (processedParams.has(userId)) {
      console.log(`Already processed user ID: ${userId}, skipping`);
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
        
        // Mark this user ID as processed
        setProcessedParams(prev => new Set([...prev, userId]));
        
        // Add a small delay to prevent potential race conditions
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = window.setTimeout(() => {
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
              timeoutRef.current = null;
            });
        }, 100) as unknown as number;
      } else {
        console.log(`No match found with user ${userId}`);
        // Still mark this userId as processed to prevent repeated attempts
        setProcessedParams(prev => new Set([...prev, userId]));
      }
    }
    
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [matches, searchParams, handleSelectMatch, processedParams]);
  
  return {
    processedParams
  };
}
