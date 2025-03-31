
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

  if (loading) {
    return <div className="p-6 text-center">読み込み中...</div>;
  }

  return (
    <div className="h-full overflow-hidden">
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
