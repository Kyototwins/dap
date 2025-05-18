
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { Match } from "@/types/messages";

export function useMessageUrlParams(
  matches: Match[], 
  handleSelectMatch: (match: Match) => Promise<void>
) {
  const [searchParams] = useSearchParams();
  const [processedParams, setProcessedParams] = useState<Set<string>>(new Set());
  const [paramProcessing, setParamProcessing] = useState(false);
  const processingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const lastProcessedRef = useRef<string | null>(null);
  const matchesLoadedRef = useRef(false);
  
  // Check for user query parameter
  useEffect(() => {
    const userId = searchParams.get('user');
    
    // Skip if we've already processed this exact userId
    if (!userId || processedParams.has(userId)) {
      return;
    }
    
    // Update matches loaded ref when matches are available
    if (matches.length > 0 && !matchesLoadedRef.current) {
      console.log(`${matches.length} matches loaded, ready for URL parameter processing`);
      matchesLoadedRef.current = true;
    }
    
    // Skip if matches aren't loaded yet or we're already processing
    if (matches.length === 0 || processingRef.current) {
      if (matches.length === 0) {
        console.log("No matches loaded yet, will process URL params when matches are available");
      }
      return;
    }
    
    // Find match with specified user
    console.log(`Looking for match with user ${userId} among ${matches.length} matches`);
    const matchWithUser = matches.find(match => match.otherUser.id === userId);
    
    if (matchWithUser) {
      // Prevent concurrent processing
      processingRef.current = true;
      setParamProcessing(true);
      
      console.log(`Found match with user ${userId}, selecting it`);
      
      // Mark this user ID as processed to prevent repeated attempts
      setProcessedParams(prev => new Set([...prev, userId]));
      lastProcessedRef.current = userId;
      
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
            setParamProcessing(false);
            timeoutRef.current = null;
          });
      }, 200) as unknown as number;
    } else {
      console.log(`No match found with user ${userId}`);
      // Still mark this userId as processed to prevent repeated attempts
      setProcessedParams(prev => new Set([...prev, userId]));
    }
    
    // Cleanup function to clear any pending timeouts
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [matches, searchParams, handleSelectMatch, processedParams]);
  
  return {
    processedParams,
    lastProcessedUserId: lastProcessedRef.current,
    paramProcessing
  };
}
