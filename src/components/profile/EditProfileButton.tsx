
import { Button } from "@/components/ui/button";

interface EditProfileButtonProps {
  onClick: () => void;
}

export function EditProfileButton({ onClick }: EditProfileButtonProps) {
  return (
    <div className="fixed bottom-24 right-4">
      <Button 
        size="lg"
        onClick={onClick}
        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg"
      >
        プロフィールを編集
      </Button>
    </div>
  );
}
