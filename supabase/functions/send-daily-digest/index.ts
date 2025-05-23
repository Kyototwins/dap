
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getUsersWithDigestEnabled, getNotificationEmail } from "./users.ts";
import { getYesterdayActivity } from "./activity.ts";
import { sendBrevoEmail, generateEmailContent } from "./email.ts";
import { corsHeaders, toJSTISOString } from "./utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Starting daily digest email process");
    console.log("Current time (UTC):", new Date().toISOString());
    console.log("Current time (JST):", toJSTISOString(new Date()));
    
    // Get all users with email digest enabled
    const usersWithDigest = await getUsersWithDigestEnabled();
    console.log(`Found ${usersWithDigest.length} users with digest enabled`);
    
    // If no users have digest enabled, log this but don't treat it as an error
    if (usersWithDigest.length === 0) {
      console.log("No users have enabled email digest. Nothing to do.");
      return new Response(
        JSON.stringify({ 
          success: true, 
          processed: 0,
          results: [],
          message: "No users have enabled email digest"
        }),
        {
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          },
        }
      );
    }
    
    const results = [];
    
    // Process each user
    for (const user of usersWithDigest) {
      const result = await processUserDigest(user);
      results.push(result);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: usersWithDigest.length,
        results 
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
      }
    );
  } catch (error: any) {
    console.error("Error in daily digest function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stack: error.stack 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
      }
    );
  }
});

/**
 * Process a single user for daily digest
 */
async function processUserDigest(user: any) {
  try {
    console.log(`Processing digest for user ${user.id}`);
    
    // Get user email (either custom notification email or default auth email)
    const email = await getNotificationEmail(user.id, user.notification_email);
    if (!email) {
      console.warn(`No email found for user ${user.id}, skipping`);
      return { userId: user.id, status: "skipped", reason: "no_email" };
    }
    
    // Get yesterday's activity
    const activity = await getYesterdayActivity(user.id);
    console.log(`Activity summary for user ${user.id}:`, activity);
    
    // Always send an email, even if there is no activity
    await sendBrevoEmail(email, activity);
    
    console.log(`Successfully sent digest to ${email}`);
    return { userId: user.id, email, status: "success" };
  } catch (error: any) {
    console.error(`Error processing user ${user.id}:`, error);
    return {
      userId: user.id,
      status: "error",
      error: error.message,
      stack: error.stack
    };
  }
}
