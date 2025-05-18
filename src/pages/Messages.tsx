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
    logMessagesData();
  }, [matches, messages, selectedMatch, searchParams]);

  const logMessagesData = () => {
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
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log("Refreshing messages page");
    try {
      await fetchMatches();
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!matches || matches.length === 0) {
    return <EmptyMatchesState onRefresh={handleRefresh} isRefreshing={isRefreshing} />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] overflow-hidden">
      <div className="flex justify-end mb-4">
        <RefreshButton onClick={handleRefresh} isRefreshing={isRefreshing} />
      </div>
      
      <MessageContainer
        matches={matches}
        selectedMatch={selectedMatch}
        messages={messages}
        onSelectMatch={handleSelectMatch}
        setMessages={setMessages}
      />
    </div>
  );
}

function LoadingState() {
  return <div className="p-6 text-center">読み込み中...</div>;
}

function EmptyMatchesState({ onRefresh, isRefreshing }: { onRefresh: () => void, isRefreshing: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <p className="mb-4">マッチしているユーザーが見つかりませんでした</p>
      <p className="text-sm text-muted-foreground mb-4">
        マッチが承認されていない可能性があります。管理者にお問い合わせください。
      </p>
      <RefreshButton onClick={onRefresh} isRefreshing={isRefreshing} />
    </div>
  );
}

function RefreshButton({ onClick, isRefreshing }: { onClick: () => void, isRefreshing: boolean }) {
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={onClick}
      disabled={isRefreshing}
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      {isRefreshing ? "Refreshing..." : "Refresh Messages"}
    </Button>
  );
}
