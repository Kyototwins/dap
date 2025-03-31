
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MatchList } from "@/components/messages/MatchList";
import { MessageChat } from "@/components/messages/MessageChat";
import type { Match, Message } from "@/types/messages";

interface MessageContainerProps {
  matches: Match[];
  selectedMatch: Match | null;
  messages: Message[];
  onSelectMatch: (match: Match) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function MessageContainer({
  matches,
  selectedMatch,
  messages,
  onSelectMatch,
  setMessages,
}: MessageContainerProps) {
  const [newMessage, setNewMessage] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Show the chat view on mobile when a match is selected
    if (selectedMatch) {
      setShowMobileChat(true);
    }
  }, [selectedMatch]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch || !newMessage.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      const { error } = await supabase
        .from("messages")
        .insert([
          {
            match_id: selectedMatch.id,
            sender_id: user.id,
            content: newMessage.trim(),
          },
        ]);

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast({
        title: "メッセージの送信に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Chat list for larger screens, or when chat isn't shown on mobile */}
      <div className={`${showMobileChat ? 'hidden md:block' : 'w-full'} md:w-1/3 border-r overflow-hidden`}>
        <MatchList 
          matches={matches} 
          selectedMatch={selectedMatch} 
          onSelectMatch={onSelectMatch}
        />
      </div>
      
      {/* Chat window */}
      <div className={`${!showMobileChat ? 'hidden md:block' : 'w-full'} md:w-2/3 overflow-hidden`}>
        {selectedMatch ? (
          <MessageChat
            selectedMatch={selectedMatch}
            messages={messages}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
            onBack={handleBackToList}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>メッセージを表示するには、左のリストからユーザーを選択してください</p>
          </div>
        )}
      </div>
    </div>
  );
}
