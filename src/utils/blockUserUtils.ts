
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const blockUser = async (otherUserId: string): Promise<boolean> => {
  try {
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
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};
