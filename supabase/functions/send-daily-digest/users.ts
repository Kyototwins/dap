
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Get all users who have enabled the email digest feature
 */
export async function getUsersWithDigestEnabled() {
  console.log("Fetching users with email_digest_enabled=true");
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email_digest_enabled, notification_email")
    .eq("email_digest_enabled", true);
  
  if (error) {
    console.error("Error fetching users with digest enabled:", error);
    throw error;
  }
  
  console.log(`Found ${data?.length || 0} users with email digest enabled`);
  return data || [];
}

/**
 * Get email address for a specific user
 */
async function getUserEmail(userId: string) {
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  
  if (error) {
    console.error(`Error fetching auth email for user ${userId}:`, error);
    throw error;
  }
  
  console.log(`Retrieved auth email for user ${userId}: ${data?.user?.email || "no email found"}`);
  return data?.user?.email;
}

/**
 * Get either the custom notification email or fallback to user's auth email
 */
export async function getNotificationEmail(userId: string, customEmail: string | null) {
  if (customEmail) {
    console.log(`Using custom notification email for user ${userId}: ${customEmail}`);
    return customEmail;
  }
  
  const authEmail = await getUserEmail(userId);
  console.log(`Using auth email for user ${userId}: ${authEmail}`);
  return authEmail;
}
