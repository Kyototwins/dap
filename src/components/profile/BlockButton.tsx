
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import { blockUser } from "@/utils/blockUserUtils";

interface BlockButtonProps {
  otherUserId: string;
  disabled?: boolean;
}

export function BlockButton({ otherUserId, disabled }: BlockButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBlock = async () => {
    if (!window.confirm("Do you want to block this user?")) return;
    
    setIsLoading(true);
    const success = await blockUser(otherUserId);
    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleBlock}
      variant="destructive"
      className="flex-1 gap-2 rounded-xl"
      disabled={isLoading || disabled}
    >
      <Ban className="w-4 h-4" />
      Block
    </Button>
  );
}
