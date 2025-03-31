
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
  } = useMessages();

  // Select the first match automatically if none is selected
  useEffect(() => {
    if (!loading && matches.length > 0 && !selectedMatch) {
      handleSelectMatch(matches[0]);
    }
  }, [loading, matches, selectedMatch, handleSelectMatch]);

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
