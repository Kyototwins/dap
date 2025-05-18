
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
        className="bg-[#7f1184] hover:bg-[#671073] shadow-lg rounded-xl"
      >
        プロフィールを編集
      </Button>
    </div>
  );
}
