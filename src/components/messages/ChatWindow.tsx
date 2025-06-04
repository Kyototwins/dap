
import { MessageChat } from "@/components/messages/MessageChat";
import { LoadingSpinner } from "@/components/messages/LoadingSpinner";
import type { Match, Message } from "@/types/messages";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ChatWindowProps {
  match: Match | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onBack: () => void;
  showMobileChat: boolean;
  messagesLoaded?: boolean;
}

export function ChatWindow({
  match,
  messages,
  setMessages,
  onBack,
  showMobileChat,
  messagesLoaded = true,
}: ChatWindowProps) {
  const navigate = useNavigate();

  const handleUserNameClick = () => {
    if (match) {
      navigate(`/user-profile/${match.otherUser.id}`);
    }
  };

  return (
    <div className={`${!showMobileChat ? 'hidden md:block' : 'w-full'} md:w-2/3 overflow-hidden`}>
      {match ? (
        <div className="h-full flex flex-col">
          <div className="border-b p-3">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={onBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h3 
                  className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={handleUserNameClick}
                >
                  {match.otherUser.first_name} {match.otherUser.last_name}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {!messagesLoaded ? (
              <div className="h-full flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <MessageChat
                match={match}
                messages={messages}
                setMessages={setMessages}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          <p>Select a user from the list to view messages</p>
        </div>
      )}
    </div>
  );
}
