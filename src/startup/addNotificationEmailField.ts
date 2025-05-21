
import { supabase } from "@/integrations/supabase/client";

export async function ensureNotificationEmailField() {
  try {
    // Add the notification_email column directly using SQL query
    const { error } = await supabase.rpc('setup_email_digest_job');
    
    if (error) {
      console.error("Error setting up email digest job:", error);
    } else {
      console.log("Successfully set up email digest job");
    }
  } catch (error) {
    console.error("Failed to set up email digest job:", error);
  }
}

// Call the function on import to ensure the job is set up
ensureNotificationEmailField();
