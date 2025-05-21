
import { supabase } from "@/integrations/supabase/client";

export async function ensureNotificationEmailField() {
  try {
    // Call the function to add the notification_email field
    const { error } = await supabase.functions.invoke("add-notification-email-field");
    
    if (error) {
      console.error("Error adding notification_email field:", error);
    } else {
      console.log("Successfully ensured notification_email field exists");
    }
  } catch (error) {
    console.error("Failed to add notification_email field:", error);
  }
}

// Call the function on import to ensure the field exists
ensureNotificationEmailField();
