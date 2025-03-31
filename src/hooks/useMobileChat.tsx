
import { useState, useEffect } from "react";
import type { Match } from "@/types/messages";

export function useMobileChat(selectedMatch: Match | null) {
  const [showMobileChat, setShowMobileChat] = useState(false);
  
  useEffect(() => {
    // Show the chat view on mobile when a match is selected
    if (selectedMatch) {
      setShowMobileChat(true);
    }
  }, [selectedMatch]);

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  return {
    showMobileChat,
    handleBackToList
  };
}
