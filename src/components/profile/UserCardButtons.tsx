
import { Heart, ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/messages";

interface UserCardButtonsProps {
  isMatched: boolean;
  isLoading: boolean;
  onMatch: () => void;
  onView: () => void;
  onMessage?: () => void;
}

export function UserCardButtons({
  isMatched,
  isLoading,
  onMatch,
  onView,
  onMessage,
}: UserCardButtonsProps) {
  return (
    <div className="flex gap-2 mt-2">
      <Button
        variant="outline"
        className="flex-1 rounded-xl"
        onClick={onView}
      >
        View Profile
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
      {isMatched ? (
        <Button
          className="flex-1 rounded-xl bg-[#7f1184] hover:bg-[#671073] text-white"
          onClick={(e) => {
            e.stopPropagation();
            if (onMessage) {
              onMessage();
            } else {
              onView();
            }
          }}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Message
        </Button>
      ) : (
        <Button
          className="flex-1 rounded-xl bg-[#7f1184] hover:bg-[#671073]"
          onClick={onMatch}
          disabled={isLoading}
        >
          <Heart className="w-4 h-4 mr-2" />
          Connect
        </Button>
      )}
    </div>
  );
}
