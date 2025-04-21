
import { useEffect } from "react";
import { useMessages } from "@/hooks/useMessages";
import { MessageContainer } from "@/components/messages/MessageContainer";

export default function Messages() {
  const {
    matches,
    selectedMatch,
    messages,
    loading,
    handleSelectMatch,
    setMessages,
    fetchMatches
  } = useMessages();
  
  // 定期的にマッチリストを更新
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMatches();
    }, 30000); // 30秒ごとに更新
    
    return () => clearInterval(interval);
  }, [fetchMatches]);
  
  // 初回ロード時にもマッチリストを更新
  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">読み込み中...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] overflow-hidden">
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
