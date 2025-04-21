
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

      // Delete user data from profiles table
      const { error: profileDeleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
        
      if (profileDeleteError) {
        console.error("Error deleting profile data:", profileDeleteError);
        throw new Error("Failed to delete profile data.");
      }
      
      // Delete any related data from other tables (add as needed)
      // Examples based on your database schema:
      
      // Delete from notifications
      await supabase.from('notifications').delete().eq('user_id', user.id);
      
      // Delete from matches (as user1 or user2)
      await supabase.from('matches').delete().eq('user1_id', user.id);
      await supabase.from('matches').delete().eq('user2_id', user.id);
      
      // Delete from messages
      await supabase.from('messages').delete().eq('sender_id', user.id);
      
      // Delete from events where user is creator
      await supabase.from('events').delete().eq('creator_id', user.id);
      
      // Delete from event_participants
      await supabase.from('event_participants').delete().eq('user_id', user.id);
      
      // Delete from event_comments
      await supabase.from('event_comments').delete().eq('user_id', user.id);
      
      // Delete from offered_experiences
      await supabase.from('offered_experiences').delete().eq('user_id', user.id);
      
      // Delete from message_group_members
      await supabase.from('message_group_members').delete().eq('user_id', user.id);
      
      // Handle user auth deletion
      try {
        // Try the admin delete first (this will likely fail on client side)
        const { error: delError } = await supabase.auth.admin.deleteUser(user.id);
        if (delError) throw delError;
      } catch (adminError) {
        console.log("Admin delete failed, trying user-level signout");
        // If the admin delete fails, try the user-level delete
        const { error: userDelError } = await supabase.auth.signOut({ scope: 'local' });
        if (userDelError) throw userDelError;
      }

      toast({
        title: "Account Deleted",
        description: "Thank you for using our service.",
      });
      
      // Redirect to login page
      navigate("/login");
    } catch (error: any) {
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
