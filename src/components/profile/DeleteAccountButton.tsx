
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function DeleteAccountButton() {
  const [openFirst, setOpenFirst] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        throw new Error("Failed to retrieve account information.");
      }

      console.log("Starting account deletion process for user:", user.id);
      
      // DELETE IN CORRECT ORDER TO SATISFY FOREIGN KEY CONSTRAINTS
      
      // 1. Delete messages first as they reference matches
      console.log("Deleting user messages...");
      await supabase.from('messages').delete().eq('sender_id', user.id);
      
      // 2. Delete event-related data
      console.log("Deleting event comments...");
      await supabase.from('event_comments').delete().eq('user_id', user.id);
      
      console.log("Deleting event participants...");
      await supabase.from('event_participants').delete().eq('user_id', user.id);
      
      console.log("Deleting events...");
      await supabase.from('events').delete().eq('creator_id', user.id);
      
      // 3. Delete other user-related data
      console.log("Deleting message group members...");
      await supabase.from('message_group_members').delete().eq('user_id', user.id);
      
      console.log("Deleting notifications...");
      await supabase.from('notifications').delete().eq('user_id', user.id);
      
      console.log("Deleting offered experiences...");
      await supabase.from('offered_experiences').delete().eq('user_id', user.id);
      
      // 4. CRITICAL: We must remove all references to this user in matches BEFORE deleting the user
      // Get all matches referencing this user
      const { data: matchesAsUser1 } = await supabase
        .from('matches')
        .select('id')
        .eq('user1_id', user.id);
        
      const { data: matchesAsUser2 } = await supabase
        .from('matches')
        .select('id')
        .eq('user2_id', user.id);
        
      // Get all match IDs
      const matchIds = [
        ...(matchesAsUser1 || []).map(match => match.id),
        ...(matchesAsUser2 || []).map(match => match.id)
      ];
      
      // Delete all messages related to those match IDs
      if (matchIds.length > 0) {
        console.log(`Deleting messages for ${matchIds.length} matches...`);
        await supabase.from('messages').delete().in('match_id', matchIds);
      }
      
      // Now delete the matches themselves
      console.log("Deleting matches as user1...");
      await supabase.from('matches').delete().eq('user1_id', user.id);
      
      console.log("Deleting matches as user2...");
      await supabase.from('matches').delete().eq('user2_id', user.id);
      
      // 5. Finally delete profile
      console.log("Deleting profile...");
      const { error: profileDeleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
        
      if (profileDeleteError) {
        throw new Error(`Failed to delete profile: ${profileDeleteError.message}`);
      }

      // 6. Call Edge Function to delete auth.users entry
      console.log("Calling edge function to delete user authentication...");
      const fnRes = await fetch("https://yxacicvkyusnykivbmtg.functions.supabase.co/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      
      const res = await fnRes.json();
      console.log("Edge function response:", res);
      
      if (!fnRes.ok || !res.success) {
        throw new Error("Failed to delete account: " + (res.error ? JSON.stringify(res.error) : ""));
      }

      toast({
        title: "Account Deleted",
        description: "Thank you for using our service.",
      });

      navigate("/login");
    } catch (error: any) {
      console.error("Account deletion error:", error);
      toast({
        title: "Deletion Failed",
        description: error.message || "An unknown error occurred while deleting your account.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpenSecond(false);
      setOpenFirst(false);
    }
  };

  return (
    <div className="my-6 flex flex-col items-end">
      <AlertDialog open={openFirst} onOpenChange={setOpenFirst}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="rounded-xl">
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              Your account cannot be recovered after deletion.<br />
              Click "Next" to proceed with the deletion process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={() => {
                setOpenFirst(false);
                setOpenSecond(true);
              }}
            >
              Next
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openSecond} onOpenChange={setOpenSecond}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Permanently delete your account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All your data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading} onClick={() => setOpenSecond(false)}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={handleDelete}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
