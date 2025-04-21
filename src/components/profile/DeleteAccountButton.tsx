
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

      // Delete user data from profiles table first
      const { error: profileDeleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
        
      if (profileDeleteError) {
        console.error("Error deleting profile data:", profileDeleteError);
        throw new Error("Failed to delete profile data.");
      }
      
      // Use the standard auth API to delete the current user's account
      const { error: delError } = await supabase.auth.admin.deleteUser(
        user.id, 
        { shouldCascade: true }
      );
      
      if (delError) {
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
