
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Ban } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlockButtonProps {
  otherUserId: string;
  disabled?: boolean;
}

export function BlockButton({ otherUserId, disabled }: BlockButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBlock = async () => {
    if (!window.confirm("Do you want to block this user?")) return;
    setIsLoading(true);
    try {
      // Instead of using a blocks table, we can create a notification to the server
      // This is a temporary solution until the blocks table is created in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create a notification indicating a block action
      const { error } = await supabase.from("notifications").insert([
        {
          user_id: user.id,
          related_id: otherUserId,
          content: "User has been blocked",
          type: "block_user"
        },
      ]);
      
      if (error) throw error;

      toast({
        title: "User blocked",
        description: "You will no longer receive messages from this user.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
