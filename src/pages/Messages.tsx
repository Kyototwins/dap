
import { useMessages } from "@/hooks/useMessages";
import { MessageContainer } from "@/components/messages/MessageContainer";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function Messages() {
  const {
    matches,
    selectedMatch,
    messages,
    loading,
    handleSelectMatch,
    setMessages,
  } = useMessages();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Update any state needed for refresh
      // The fetchMatches function is already in the useMessages hook
      window.location.reload();
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
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
          更新
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
          <p className="mb-4">まだマッチしているユーザーがいません</p>
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
