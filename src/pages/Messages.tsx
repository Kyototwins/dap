import { useMessages } from "@/hooks/useMessages";
import { MessageContainer } from "@/components/messages/MessageContainer";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Messages() {
  const {
    matches,
    selectedMatch,
    messages,
    loading,
    handleSelectMatch,
    setMessages,
    fetchMatches,
  } = useMessages();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchParams] = useSearchParams();

  // Debug log
  useEffect(() => {
    console.log("Messages page rendered");
    console.log(`Matches available: ${matches.length}`);
    if (matches.length > 0) {
      matches.forEach((match, idx) => {
        console.log(`Match ${idx+1}: ID=${match.id}, Status=${match.status}, User=${match.otherUser.first_name}`);
      });
    }
    console.log(`Messages available: ${messages.length}`);
    console.log(`Selected match: ${selectedMatch?.id || 'none'}`);
    
    // Check if there's a specific user to display from URL parameters
    const userIdParam = searchParams.get('user');
    console.log(`URL user param: ${userIdParam || 'none'}`);
  }, [matches, messages, selectedMatch, searchParams]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log("Refreshing messages page");
    try {
      // Use the fetchMatches function directly instead of reloading the page
      await fetchMatches();
      setIsRefreshing(false);
    } catch (error) {
      console.error("Error refreshing:", error);
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] overflow-hidden">
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh Messages
        </Button>
      </div>
      
      {loading ? (
        <div className="p-6 text-center">読み込み中...</div>
      ) : matches && matches.length > 0 ? (
        <MessageContainer
          matches={matches}
          selectedMatch={selectedMatch}
          messages={messages}
          onSelectMatch={handleSelectMatch}
          setMessages={setMessages}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <p className="mb-4">マッチしているユーザーが見つかりませんでした</p>
          <p className="text-sm text-muted-foreground mb-4">
            マッチが承認されていない可能性があります。管理者にお問い合わせください。
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            再読み込み
          </Button>
        </div>
      )}
    </div>
  );
}
