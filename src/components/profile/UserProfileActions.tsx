
import { MessageSquare, Heart, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUserMatchStatus } from "./hooks/useUserMatchStatus";
import { BlockButton } from "./BlockButton";

interface UserProfileActionsProps {
  isCurrentUser: boolean;
  profileId: string;
  onEditProfileClick: () => void;
}

export function UserProfileActions({
  isCurrentUser,
  profileId,
  onEditProfileClick,
}: UserProfileActionsProps) {
  const navigate = useNavigate();
  // onMatched: マッチ後にメッセージ画面へ遷移
  const { isMatched, isLoading, handleMatch } = useUserMatchStatus({
    id: profileId,
    onMatched: () => navigate(`/messages?user=${profileId}`),
  });

  const handleMessage = () => {
    navigate(`/messages?user=${profileId}`);
  };

  return (
    <div className="flex gap-3 mb-6">
      {isCurrentUser ? (
        <Button
          onClick={onEditProfileClick}
          className="flex-1 gap-2 bg-[#7f1184] hover:bg-[#671073] rounded-xl"
        >
          <Edit className="w-4 h-4" />
          <span>編集</span>
        </Button>
      ) : isMatched ? (
        <>
          <Button
            onClick={handleMessage}
            className="flex-1 gap-2 bg-[#7f1184] hover:bg-[#671073] rounded-xl text-white"
          >
            <MessageSquare className="w-4 h-4" />
            メッセージ
          </Button>
          <BlockButton otherUserId={profileId} />
        </>
      ) : (
        <Button
          onClick={() => handleMatch({ id: profileId })}
          disabled={isLoading}
          className="flex-1 gap-2 bg-[#7f1184] hover:bg-[#671073] text-white rounded-xl"
        >
          <Heart className="w-4 h-4 mr-2" />
          Connect
        </Button>
      )}
    </div>
  );
}
