
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Define the time range - from 9:30 AM yesterday to 9:29 AM today
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Set times to 9:30 AM yesterday and 9:29 AM today
    yesterday.setHours(9, 30, 0, 0);
    now.setHours(9, 29, 59, 999);
    
    // Get users who have enabled email digest
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("id, first_name, notification_email, email_digest_enabled")
      .eq("email_digest_enabled", true);

    if (usersError) throw usersError;
    
    console.log(`Found ${users?.length || 0} users with email digest enabled`);
    
    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No users with email digest enabled",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // For each user, get their notifications and send an email
    for (const user of users) {
      try {
        // Get user auth details to find their email
        const { data: authUser } = await supabase.auth.admin.getUserById(user.id);
        
        // Skip if user not found
        if (!authUser?.user) {
          console.log(`Auth user not found for profile ID: ${user.id}`);
          continue;
        }
        
        // Use custom notification email if set, otherwise use default auth email
        const emailToUse = user.notification_email || authUser.user.email;
        
        if (!emailToUse) {
          console.log(`No email found for user: ${user.id}`);
          continue;
        }
        
        // Get recent notifications
        const { data: notifications, error: notifError } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .gte("created_at", yesterday.toISOString())
          .lt("created_at", now.toISOString())
          .order("created_at", { ascending: false });
          
        if (notifError) {
          console.error(`Error fetching notifications for user ${user.id}:`, notifError);
          continue;
        }
        
        // Skip if no notifications
        if (!notifications || notifications.length === 0) {
          console.log(`No recent notifications for user ${user.id}`);
          continue;
        }
        
        console.log(`Sending email digest to ${emailToUse} with ${notifications.length} notifications`);
        
        // Format notification content for email
        let notificationsList = '';
        notifications.forEach((notif) => {
          notificationsList += `• ${notif.content}\n`;
        });
        
        // Send the email
        // Note: Actual email sending code would be here using a service like Resend, SendGrid, etc.
        // For now, we'll just log the content
        console.log(`
          To: ${emailToUse}
          Subject: Your Daily Notification Digest
          
          Hello ${user.first_name || "there"},
          
          Here's your daily notification summary:
          
          ${notificationsList}
          
          Best regards,
          The Team
        `);
        
        // In a production app, you would use a proper email service
        // Example with Resend.com:
        // const emailResponse = await resend.emails.send({
        //   from: "app@example.com",
        //   to: emailToUse,
        //   subject: "Your Daily Notification Digest",
        //   html: `<h1>Hello ${user.first_name || "there"},</h1>...`,
        // });
      } catch (userError) {
        console.error(`Error processing user ${user.id}:`, userError);
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent email digest to ${users.length} users`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    console.error("Error in send-daily-digest function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
