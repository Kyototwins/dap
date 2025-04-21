
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

      // WARNING: Order matters for foreign key constraints
      // Delete relational data in proper order
      
      // First delete data that references matches
      await supabase.from('messages').delete().eq('sender_id', user.id);
      
      // Delete event-related data
      await supabase.from('event_comments').delete().eq('user_id', user.id);
      await supabase.from('event_participants').delete().eq('user_id', user.id);
      await supabase.from('events').delete().eq('creator_id', user.id);
      
      // Delete message groups and notifications
      await supabase.from('message_group_members').delete().eq('user_id', user.id);
      await supabase.from('notifications').delete().eq('user_id', user.id);
      
      // Delete offered_experiences
      await supabase.from('offered_experiences').delete().eq('user_id', user.id);
      
      // Delete matches where user is either user1 or user2
      // These need to be deleted after messages are deleted
      await supabase.from('matches').delete().eq('user1_id', user.id);
      await supabase.from('matches').delete().eq('user2_id', user.id);
      
      // Delete profile (last)
      await supabase.from('profiles').delete().eq('id', user.id);

      // Call Edge Function to delete auth.users entry
      const fnRes = await fetch("https://yxacicvkyusnykivbmtg.functions.supabase.co/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      const res = await fnRes.json();
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
        description: error.message,
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
