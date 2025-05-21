
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
 * Get users who have enabled the email digest feature and whose notification time is current hour
 */
async function getUsersForCurrentHour() {
  // Get current hour in JST (Japan Standard Time)
  const now = new Date();
  // Format as HH:00 (24-hour format with leading zero)
  const currentHour = `${now.getHours().toString().padStart(2, '0')}:00`;
  
  console.log(`Getting users for notification time: ${currentHour}`);
  
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email_digest_enabled, notification_email, notification_time")
    .eq("email_digest_enabled", true)
    .eq("notification_time", currentHour);
  
  if (error) {
    console.error("Error fetching users for current hour:", error);
    throw error;
  }
  
  console.log(`Found ${data?.length || 0} users with notification time ${currentHour}`);
  return data || [];
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
 * Get either the custom notification email or fallback to user's auth email
 */
async function getNotificationEmail(userId: string, customEmail: string | null) {
  if (customEmail) return customEmail;
  return await getUserEmail(userId);
}

/**
 * Query for likes received in the past 24 hours for a specific user
 */
async function getLikesReceived(userId: string, startTime: string, endTime: string) {
  const { data, error } = await supabase
    .from("matches")
    .select("id")
    .eq("user2_id", userId)
    .eq("status", "matched")
    .gte("created_at", startTime)
    .lt("created_at", endTime);
  
  if (error) {
    console.error("Error fetching likes:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Query for messages received in the past 24 hours for a specific user
 */
async function getMessagesReceived(userId: string, startTime: string, endTime: string) {
  // Get messages received in last 24 hours
  const { data: messagesData, error: messagesError } = await supabase
    .from("messages")
    .select("id, match_id, sender_id")
    .neq("sender_id", userId)
    .gte("created_at", startTime)
    .lt("created_at", endTime);
  
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
 * Query for new events created in the past 24 hours
 */
async function getNewEvents(startTime: string, endTime: string) {
  const { data, error } = await supabase
    .from("events")
    .select("title")
    .gte("created_at", startTime)
    .lt("created_at", endTime);
  
  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Query for participations in user's events from the past 24 hours
 */
async function getEventParticipations(userId: string, startTime: string, endTime: string) {
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
  
  // Get participations for user's events from last 24 hours
  const { data, error } = await supabase
    .from("event_participants")
    .select("id")
    .in("event_id", userEventIds)
    .gte("created_at", startTime)
    .lt("created_at", endTime);
  
  if (error) {
    console.error("Error fetching participations:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Query for comments on user's events from the past 24 hours
 */
async function getEventComments(userId: string, startTime: string, endTime: string) {
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
  
  // Get comments for user's events from last 24 hours
  const { data, error } = await supabase
    .from("event_comments")
    .select("id")
    .in("event_id", userEventIds)
    .gte("created_at", startTime)
    .lt("created_at", endTime);
  
  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Get activity summary for a specific user for the past 24 hours
 */
async function get24HourActivity(userId: string): Promise<ActivitySummary> {
  // Get time period for last 24 hours
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const startTime = yesterday.toISOString();
  const endTime = now.toISOString();
  
  console.log(`Getting activity from ${startTime} to ${endTime} for user ${userId}`);
  
  const likes = await getLikesReceived(userId, startTime, endTime);
  const messages = await getMessagesReceived(userId, startTime, endTime);
  const newEvents = await getNewEvents(startTime, endTime);
  const participations = await getEventParticipations(userId, startTime, endTime);
  const comments = await getEventComments(userId, startTime, endTime);
  
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
    ? `新しいイベント: ${activity.newEvents.map(event => event.title).join(", ")}`
    : "過去24時間に新しいイベントはありません";
  
  return `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h1 style="color: #5640AA;">あなたの日次活動サマリー</h1>
      <p>こんにちは！過去24時間のLanguage Connectでの活動をお知らせします：</p>
      
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>👍 新しいいいね:</strong> ${activity.likesReceived}件</p>
        <p><strong>💬 新しいメッセージ:</strong> ${activity.messagesReceived}件</p>
        <p><strong>🎉 ${activity.newEvents.length}件の新しいイベントが投稿されました</strong></p>
        <p><strong>👥 あなたのイベントへの新しい参加者:</strong> ${activity.eventParticipations}人</p>
        <p><strong>💬 あなたのイベントへの新しいコメント:</strong> ${activity.eventComments}件</p>
      </div>
      
      <p>言語交換コミュニティとの交流を続けましょう！</p>
      <p><a href="${appUrl}" style="display: inline-block; background-color: #5640AA; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Language Connectに移動</a></p>
      
      <p style="margin-top: 30px; font-size: 14px; color: #777;">
        リンクに問題がある場合は、サイトに戻って直接ログインしてください。システムは正常に動作するはずです！
      </p>
      <p style="font-size: 14px; color: #777;">
        問題が解決しない場合は、DAPのインスタグラムDMでご連絡ください。
      </p>
      
      <p style="font-size: 12px; color: #999; margin-top: 30px;">
        メール設定を管理するには、Language Connectアプリのプロフィール設定にアクセスしてください。
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
        subject: "Language Connect 日次アクティビティサマリー",
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
    // Get user email (either custom notification email or default auth email)
    const email = await getNotificationEmail(user.id, user.notification_email);
    if (!email) {
      console.warn(`No email found for user ${user.id}, skipping`);
      return { userId: user.id, status: "skipped", reason: "no_email" };
    }
    
    // Get 24 hour activity
    const activity = await get24HourActivity(user.id);
    
    // Send email
    await sendBrevoEmail(email, activity);
    
    console.log(`Successfully sent digest to ${email}`);
    return { 
      userId: user.id, 
      email, 
      time: user.notification_time || "09:00", 
      status: "success" 
    };
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
    console.log("Starting daily digest email process for current hour users");
    
    // Get users with email digest enabled for the current hour
    const usersForCurrentHour = await getUsersForCurrentHour();
    console.log(`Found ${usersForCurrentHour.length} users with digest enabled for current hour`);
    
    const results = [];
    
    // Process each user
    for (const user of usersForCurrentHour) {
      const result = await processUserDigest(user);
      results.push(result);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: usersForCurrentHour.length,
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
