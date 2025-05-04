
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
  
  const { isMatched, isLoading, handleMatch } = useUserMatchStatus({
    id: profileId,
    onMatched: () => navigate(`/messages?user=${profileId}`),
  });

  const handleMessage = () => {
    navigate(`/messages?user=${profileId}`);
  };

  if (isCurrentUser) {
    return (
      <div className="flex gap-3 mb-6">
        <EditButton onClick={onEditProfileClick} />
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-6">
      {isMatched ? (
        <>
          <MessageButton onClick={handleMessage} />
          <BlockButton otherUserId={profileId} />
        </>
      ) : (
        <ConnectButton 
          onClick={() => handleMatch({ id: profileId })} 
          disabled={isLoading}
        />
      )}
    </div>
  );
}

// Extract button components for better readability
function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="flex-1 gap-2 bg-[#7f1184] hover:bg-[#671073] rounded-xl"
    >
      <Edit className="w-4 h-4" />
      <span>Edit</span>
    </Button>
  );
}

function MessageButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="flex-1 gap-2 bg-[#7f1184] hover:bg-[#671073] rounded-xl text-white"
    >
      <MessageSquare className="w-4 h-4" />
      Message
    </Button>
  );
}

function ConnectButton({ onClick, disabled }: { onClick: () => void, disabled: boolean }) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 gap-2 bg-[#7f1184] hover:bg-[#671073] text-white rounded-xl"
    >
      <Heart className="w-4 h-4 mr-2" />
      Connect
    </Button>
  );
}
