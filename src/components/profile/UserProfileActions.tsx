
import { Edit, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfileActionsProps {
  isCurrentUser: boolean;
  onMessageClick: () => void;
  onEditProfileClick: () => void;
}

export function UserProfileActions({ 
  isCurrentUser, 
  onMessageClick, 
  onEditProfileClick 
}: UserProfileActionsProps) {
  return (
    <div className="flex gap-3 mb-6">
      <Button 
        onClick={onMessageClick}
        variant="outline"
        className="flex-1 gap-2 border-gray-200"
      >
        <MessageSquare className="w-4 h-4" />
        <span>メッセージ</span>
      </Button>
      
      {isCurrentUser ? (
        <Button 
          onClick={onEditProfileClick}
          className="flex-1 gap-2 bg-doshisha-purple hover:bg-doshisha-darkPurple"
        >
          <Edit className="w-4 h-4" />
          <span>編集</span>
        </Button>
      ) : (
        <Button 
          className="flex-1 gap-2 bg-doshisha-purple hover:bg-doshisha-darkPurple"
        >
          評価
        </Button>
      )}
    </div>
  );
}
