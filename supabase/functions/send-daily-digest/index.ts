
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const brevoApiKey = Deno.env.get("BREVO_API_KEY") as string;

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
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email_digest_enabled")
    .eq("email_digest_enabled", true);
  
  if (error) throw error;
  return data;
}

/**
 * Get email address for a specific user
 */
async function getUserEmail(userId: string) {
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  
  if (error) throw error;
  return data?.user?.email;
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
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const yesterdayStart = yesterday.toISOString();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayStart = today.toISOString();
  
  const likes = await getLikesReceived(userId, yesterdayStart, todayStart);
  const messages = await getMessagesReceived(userId, yesterdayStart, todayStart);
  const newEvents = await getNewEvents(yesterdayStart, todayStart);
  const participations = await getEventParticipations(userId, yesterdayStart, todayStart);
  const comments = await getEventComments(userId, yesterdayStart, todayStart);
  
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
  try {
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
          email: "notifications@language-connect-app.com",
        },
        to: [{ email }],
        subject: "Your Daily Language Connect Summary",
        htmlContent: generateEmailContent(activity),
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send email: ${response.status} ${errorText}`);
    }
    
    return await response.json();
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
    // Get user email
    const email = await getUserEmail(user.id);
    if (!email) {
      console.warn(`No email found for user ${user.id}, skipping`);
      return { userId: user.id, status: "skipped", reason: "no_email" };
    }
    
    // Get yesterday's activity
    const activity = await getYesterdayActivity(user.id);
    
    // Send email
    await sendBrevoEmail(email, activity);
    
    console.log(`Successfully sent digest to ${email}`);
    return { userId: user.id, email, status: "success" };
  } catch (error: any) {
    console.error(`Error processing user ${user.id}:`, error);
    return {
      userId: user.id,
      status: "error",
      error: error.message
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
    
    // Get all users with email digest enabled
    const usersWithDigest = await getUsersWithDigestEnabled();
    console.log(`Found ${usersWithDigest.length} users with digest enabled`);
    
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
      JSON.stringify({ success: false, error: error.message }),
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
