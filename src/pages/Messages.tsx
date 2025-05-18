
import { useMessages } from "@/hooks/useMessages";
import { MessageContainer } from "@/components/messages/MessageContainer";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState, useEffect, useRef, memo } from "react";

const Messages = memo(function Messages() {
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
  const [hasInitialized, setHasInitialized] = useState(false);
  const initialRenderRef = useRef(true);

  // Debug log and initialization effect with cleanup to prevent memory leaks
  useEffect(() => {
    if (initialRenderRef.current) {
      console.log("Messages page mounted", {
        matchesCount: matches.length,
        loading
      });
      initialRenderRef.current = false;
    }
    
    console.log("Messages page rendered with state:", {
      matchesCount: matches.length,
      messagesCount: messages.length,
      hasSelectedMatch: !!selectedMatch,
      loading,
      hasInitialized
    });

    // Set initialization flag once loading is complete
    if (!hasInitialized && !loading && !initialRenderRef.current) {
      console.log("Messages page initialization complete");
      setHasInitialized(true);
    }

    // Cleanup function
    return () => {
      console.log("Messages page unmounting");
      // Ensure any pending operations are properly cleaned up
    };
  }, [matches, messages, selectedMatch, loading, hasInitialized]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
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

  if (loading && !hasInitialized) {
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
});

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

export default Messages;
