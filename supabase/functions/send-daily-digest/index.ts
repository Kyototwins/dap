
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const brevoApiKey = Deno.env.get("BREVO_API_KEY") as string;

if (!brevoApiKey) {
  console.error("BREVO_API_KEY environment variable is not set");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ActivitySummary {
  likesReceived: number;
  messagesReceived: number;
  newEvents: Array<{title: string}>;
  eventParticipations: number;
  eventComments: number;
}

/**
 * Get all users who have enabled the email digest feature
 */
async function getUsersWithDigestEnabled() {
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
async function getNotificationEmail(userId: string, customEmail: string | null) {
  if (customEmail) {
    console.log(`Using custom notification email for user ${userId}: ${customEmail}`);
    return customEmail;
  }
  
  const authEmail = await getUserEmail(userId);
  console.log(`Using auth email for user ${userId}: ${authEmail}`);
  return authEmail;
}

/**
 * Convert a Date to JST (Japan Standard Time)
 */
function toJST(date: Date): Date {
  // JST is UTC+9
  return new Date(date.getTime() + (9 * 60 * 60 * 1000));
}

/**
 * Convert a Date to ISO string in JST timezone
 */
function toJSTISOString(date: Date): string {
  const jstDate = toJST(date);
  return jstDate.toISOString();
}

/**
 * Query for likes received yesterday for a specific user
 */
async function getLikesReceived(userId: string, yesterdayStart: string, todayStart: string) {
  const { data, error } = await supabase
    .from("matches")
    .select("id")
    .eq("user2_id", userId)
    .eq("status", "matched")
    .gte("created_at", yesterdayStart)
    .lt("created_at", todayStart);
  
  if (error) {
    console.error("Error fetching likes:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Query for messages received yesterday for a specific user
 */
async function getMessagesReceived(userId: string, yesterdayStart: string, todayStart: string) {
  // Get messages received yesterday
  const { data: messagesData, error: messagesError } = await supabase
    .from("messages")
    .select("id, match_id, sender_id")
    .neq("sender_id", userId)
    .gte("created_at", yesterdayStart)
    .lt("created_at", todayStart);
  
  if (messagesError) {
    console.error("Error fetching messages:", messagesError);
    return [];
  }
  
  // Get user's matches
  const { data: userMatches, error: matchesError } = await supabase
    .from("matches")
    .select("id")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);
  
  if (matchesError) {
    console.error("Error fetching matches:", matchesError);
    return [];
  }
  
  // Filter messages to only include those from the user's matches
  const userMatchIds = userMatches?.map(match => match.id) || [];
  return (messagesData || []).filter(msg => userMatchIds.includes(msg.match_id));
}

/**
 * Query for new events created yesterday
 */
async function getNewEvents(yesterdayStart: string, todayStart: string) {
  const { data, error } = await supabase
    .from("events")
    .select("title")
    .gte("created_at", yesterdayStart)
    .lt("created_at", todayStart);
  
  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Query for participations in user's events from yesterday
 */
async function getEventParticipations(userId: string, yesterdayStart: string, todayStart: string) {
  // Get user's events
  const { data: userEvents, error: userEventsError } = await supabase
    .from("events")
    .select("id")
    .eq("creator_id", userId);
  
  if (userEventsError) {
    console.error("Error fetching user events:", userEventsError);
    return [];
  }
  
  const userEventIds = userEvents?.map(event => event.id) || [];
  
  // Get participations for user's events from yesterday
  const { data, error } = await supabase
    .from("event_participants")
    .select("id")
    .in("event_id", userEventIds)
    .gte("created_at", yesterdayStart)
    .lt("created_at", todayStart);
  
  if (error) {
    console.error("Error fetching participations:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Query for comments on user's events from yesterday
 */
async function getEventComments(userId: string, yesterdayStart: string, todayStart: string) {
  // Get user's events
  const { data: userEvents, error: userEventsError } = await supabase
    .from("events")
    .select("id")
    .eq("creator_id", userId);
  
  if (userEventsError) {
    console.error("Error fetching user events:", userEventsError);
    return [];
  }
  
  const userEventIds = userEvents?.map(event => event.id) || [];
  
  // Get comments for user's events from yesterday
  const { data, error } = await supabase
    .from("event_comments")
    .select("id")
    .in("event_id", userEventIds)
    .gte("created_at", yesterdayStart)
    .lt("created_at", todayStart);
  
  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Get activity summary for a specific user for yesterday
 */
async function getYesterdayActivity(userId: string): Promise<ActivitySummary> {
  console.log(`Getting yesterday's activity for user ${userId}`);
  
  // Get yesterday's date in JST (start of day)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setUTCHours(0, 0, 0, 0); // This is UTC time
  const yesterdayJST = toJSTISOString(yesterday);
  
  // Get today's date in JST (start of day)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // This is UTC time
  const todayJST = toJSTISOString(today);
  
  console.log(`Date range for activity: ${yesterdayJST} to ${todayJST}`);
  
  const likes = await getLikesReceived(userId, yesterdayJST, todayJST);
  const messages = await getMessagesReceived(userId, yesterdayJST, todayJST);
  const newEvents = await getNewEvents(yesterdayJST, todayJST);
  const participations = await getEventParticipations(userId, yesterdayJST, todayJST);
  const comments = await getEventComments(userId, yesterdayJST, todayJST);
  
  console.log(`Activity summary for user ${userId}: likes=${likes.length}, messages=${messages.length}, events=${newEvents.length}, participations=${participations.length}, comments=${comments.length}`);
  
  return {
    likesReceived: likes.length || 0,
    messagesReceived: messages.length || 0,
    newEvents: newEvents || [],
    eventParticipations: participations.length || 0,
    eventComments: comments.length || 0,
  };
}

/**
 * Generate email HTML content based on activity data
 */
function generateEmailContent(activity: ActivitySummary, appUrl = "https://language-connect-app.com"): string {
  const newEventsText = activity.newEvents.length > 0 
    ? `New events: ${activity.newEvents.map(event => event.title).join(", ")}`
    : "No new events yesterday";
  
  return `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h1 style="color: #5640AA;">Your Daily Activity Summary</h1>
      <p>Hello! Here's what happened in Language Connect yesterday:</p>
      
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>👍 New likes received:</strong> ${activity.likesReceived}</p>
        <p><strong>💬 New messages received:</strong> ${activity.messagesReceived}</p>
        <p><strong>🎉 ${activity.newEvents.length} new events were posted</strong></p>
        <p><strong>👥 New participants in your events:</strong> ${activity.eventParticipations}</p>
        <p><strong>💬 New comments on your events:</strong> ${activity.eventComments}</p>
      </div>
      
      <p>Stay engaged with your language exchange community!</p>
      <p><a href="${appUrl}" style="display: inline-block; background-color: #5640AA; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Language Connect</a></p>
      
      <p style="margin-top: 30px; font-size: 14px; color: #777;">
        If you encounter any issues with the links, please return to the site and log in directly. The system should work for you!<br>
        リンクに問題がある場合は、サイトに戻ってログインしてみてください。システムは正常に動作するはずです！
      </p>
      <p style="font-size: 14px; color: #777;">
        If you continue to experience issues, please contact us via DAP Instagram DM.<br>
        問題が解決しない場合は、DAPのインスタグラムのDMでご連絡ください。
      </p>
      
      <p style="font-size: 12px; color: #999; margin-top: 30px;">
        To manage your email preferences, visit your profile settings in the Language Connect app.
      </p>
    </body>
    </html>
  `;
}

/**
 * Send an email using Brevo API
 */
async function sendBrevoEmail(email: string, activity: ActivitySummary) {
  if (!brevoApiKey) {
    throw new Error("BREVO_API_KEY is not set. Unable to send email.");
  }
  
  try {
    console.log(`Attempting to send digest email to ${email}`);
    
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: "Language Connect",
          email: "notifications@dapsince2025.com",
        },
        to: [{ email }],
        subject: "Your Daily Language Connect Summary",
        htmlContent: generateEmailContent(activity),
      }),
    });
    
    const responseBody = await response.text();
    console.log(`Brevo API response status: ${response.status}`);
    console.log(`Brevo API response body: ${responseBody}`);
    
    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.status} ${responseBody}`);
    }
    
    return JSON.parse(responseBody);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

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
