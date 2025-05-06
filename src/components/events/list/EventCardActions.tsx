
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Check, Edit, Loader2, Plus, Trash2 } from "lucide-react";

interface EventCardActionsProps {
  isCreator: boolean;
  isParticipating: boolean;
  isPastEvent: boolean;
  isProcessing: boolean;
  isDisabled: boolean;
  displayedParticipants: number;
  maxParticipants: number;
  onJoin: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: () => void;
  eventId: string;
}

export function EventCardActions({ 
  isCreator, 
  isParticipating, 
  isPastEvent, 
  isProcessing, 
  isDisabled,
  displayedParticipants,
  maxParticipants,
  onJoin, 
  onEdit,
  onDelete,
  eventId
}: EventCardActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Handle button state for event participation
  let buttonText = "イベントに参加する";
  let buttonClasses = "bg-[#7f1184] hover:bg-[#671073] text-white";
  let buttonIcon = <Plus className="w-4 h-4 mr-1" />;
  
  if (isProcessing) {
    buttonText = "参加中...";
    buttonClasses = "bg-gray-300 text-gray-600 cursor-wait";
    buttonIcon = <Loader2 className="w-4 h-4 mr-1 animate-spin" />;
  } else if (isParticipating) {
    buttonText = "参加済み";
    buttonClasses = "bg-[#b65dbb] hover:bg-[#a74bae] text-white"; // Lighter shade of purple
    buttonIcon = <Check className="w-4 h-4 mr-1" />;
  } else if (isPastEvent) {
    buttonText = "イベント終了";
    buttonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed";
    buttonIcon = null;
  } else if (maxParticipants !== 0 && displayedParticipants >= maxParticipants) {
    buttonText = "満員";
    buttonClasses = "bg-gray-300 text-gray-500 cursor-not-allowed";
    buttonIcon = null;
  }

  // Handle delete confirmation
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete();
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="mt-4 flex gap-2">
        <Button
          className={`flex-1 rounded-xl ${buttonClasses}`}
          disabled={isDisabled || isPastEvent || (!isParticipating && maxParticipants !== 0 && displayedParticipants >= maxParticipants) || isParticipating}
          onClick={onJoin}
          aria-label={buttonText}
        >
          {buttonIcon}
          {buttonText}
        </Button>
        
        {isCreator && (
          <>
            <Button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl"
              onClick={onEdit}
              title="イベントを編集"
              disabled={isProcessing}
              aria-label="イベントを編集"
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              className="bg-red-100 hover:bg-red-200 text-red-700 rounded-xl"
              onClick={handleDeleteClick}
              title="イベントを削除"
              disabled={isProcessing}
              aria-label="イベントを削除"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={e => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>イベントを削除</AlertDialogTitle>
            <AlertDialogDescription>
              このイベントを本当に削除しますか？この操作は元に戻せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={e => e.stopPropagation()}>キャンセル</AlertDialogCancel>
            <AlertDialogAction 
              onClick={e => {
                e.stopPropagation();
                confirmDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
