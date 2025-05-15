
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Main handler for the edge function
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Starting daily digest email function");

  try {
    // Get all users with complete profiles
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("id, first_name, avatar_url")
      .not("first_name", "is", null);

    if (usersError) {
      throw new Error(`Error fetching users: ${usersError.message}`);
    }

    console.log(`Found ${users?.length || 0} users with profiles`);
    
    // Process each user to gather their digest data and send email
    for (const user of (users || [])) {
      try {
        await processUserDigest(user.id);
      } catch (userError) {
        console.error(`Error processing user ${user.id}: ${userError}`);
        // Continue with other users even if one fails
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Processed ${users?.length || 0} users for daily digest` 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error) {
    console.error("Error in daily digest function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Process digest data for a single user
async function processUserDigest(userId: string): Promise<void> {
  console.log(`Processing digest for user ${userId}`);
  
  // 1. Get user's email from auth
  const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
  if (userError || !user) {
    throw new Error(`Error fetching user auth data: ${userError?.message || "User not found"}`);
  }
  
  // 2. Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  
  if (profileError || !profile) {
    throw new Error(`Error fetching profile: ${profileError?.message || "Profile not found"}`);
  }

  // Get yesterday's date cutoff for "new" items
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString();
  
  // 3. Get new likes (pending matches)
  const { data: newLikes, error: likesError } = await supabase
    .from("matches")
    .select("*, user1:profiles!matches_user1_id_fkey(first_name, avatar_url)")
    .eq("user2_id", userId)
    .eq("status", "pending")
    .gt("created_at", yesterdayISO);
  
  if (likesError) {
    console.error(`Error fetching likes: ${likesError.message}`);
  }
  
  // 4. Get new messages
  const { data: matches, error: matchError } = await supabase
    .from("matches")
    .select("id")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq("status", "accepted");
  
  if (matchError) {
    console.error(`Error fetching matches: ${matchError.message}`);
  }

  let newMessages = [];
  if (matches && matches.length > 0) {
    const matchIds = matches.map(m => m.id);
    
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*, sender:profiles!messages_sender_id_fkey(first_name, avatar_url)")
      .in("match_id", matchIds)
      .neq("sender_id", userId)
      .gt("created_at", yesterdayISO);
    
    if (messagesError) {
      console.error(`Error fetching messages: ${messagesError.message}`);
    } else {
      newMessages = messages || [];
    }
  }
  
  // 5. Get new match confirmations
  const { data: newMatches, error: newMatchError } = await supabase
    .from("matches")
    .select("*, user1:profiles!matches_user1_id_fkey(first_name, avatar_url), user2:profiles!matches_user2_id_fkey(first_name, avatar_url)")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq("status", "accepted")
    .gt("created_at", yesterdayISO);
  
  if (newMatchError) {
    console.error(`Error fetching new matches: ${newMatchError.message}`);
  }
  
  // 6. Get new events created today
  const { data: newEvents, error: newEventsError } = await supabase
    .from("events")
    .select("*, creator:profiles!events_creator_id_fkey(first_name, avatar_url)")
    .gt("created_at", yesterdayISO);
  
  if (newEventsError) {
    console.error(`Error fetching new events: ${newEventsError.message}`);
  }
  
  // 7. Get events happening in next 3 days
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  const today = new Date();
  
  const { data: upcomingEvents, error: upcomingError } = await supabase
    .from("events")
    .select("*")
    .gte("date", today.toISOString())
    .lte("date", threeDaysFromNow.toISOString());
  
  if (upcomingError) {
    console.error(`Error fetching upcoming events: ${upcomingError.message}`);
  }

  // 8. Check if there are any notifications to send
  const hasNotifications = 
    (newLikes && newLikes.length > 0) || 
    (newMessages && newMessages.length > 0) || 
    (newMatches && newMatches.length > 0) || 
    (newEvents && newEvents.length > 0) || 
    (upcomingEvents && upcomingEvents.length > 0);
  
  if (!hasNotifications) {
    console.log(`No notifications for user ${userId}, skipping email`);
    return;
  }
  
  // 9. Generate and send the email
  await sendDigestEmail({
    email: user.email,
    username: profile.first_name || "User",
    newLikes: newLikes || [],
    newMessages: newMessages || [],
    newMatches: newMatches || [],
    newEvents: newEvents || [],
    upcomingEvents: upcomingEvents || []
  });
}

// Format date to a readable string
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
}

// Send the digest email via Resend
async function sendDigestEmail({
  email,
  username,
  newLikes,
  newMessages,
  newMatches,
  newEvents,
  upcomingEvents
}: {
  email: string;
  username: string;
  newLikes: any[];
  newMessages: any[];
  newMatches: any[];
  newEvents: any[];
  upcomingEvents: any[];
}): Promise<void> {
  console.log(`Sending digest email to ${email}`);
  
  // Generate the HTML content for the email
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .section { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        h1 { color: #2754C5; }
        h2 { color: #444; margin-top: 25px; font-size: 18px; }
        .item { margin-bottom: 15px; }
        .name { font-weight: bold; }
        .message { color: #666; font-style: italic; }
        .date { color: #888; font-size: 12px; }
        .event { background-color: #f5f5f5; padding: 10px; border-radius: 4px; margin-bottom: 10px; }
        .event-title { font-weight: bold; }
        .footer { margin-top: 30px; font-size: 12px; color: #888; text-align: center; }
        .badge { display: inline-block; background-color: #e0eaff; color: #2754C5; padding: 2px 6px; border-radius: 10px; font-size: 12px; margin-left: 5px; }
        .divider { height: 1px; background-color: #eee; margin: 15px 0; }
      </style>
    </head>
    <body>
      <h1>DAP デイリーアップデート</h1>
      <p>こんにちは、${username}さん</p>
      <p>昨日から今日にかけての新しい活動やイベント情報をお届けします。</p>
      
      ${newLikes.length > 0 ? `
        <div class="section">
          <h2>新しいいいね <span class="badge">${newLikes.length}</span></h2>
          ${newLikes.map(like => `
            <div class="item">
              <span class="name">${like.user1.first_name || 'User'}</span>さんがあなたに興味を持っています！
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${newMessages.length > 0 ? `
        <div class="section">
          <h2>新しいメッセージ <span class="badge">${newMessages.length}</span></h2>
          ${newMessages.map(msg => `
            <div class="item">
              <div class="name">${msg.sender.first_name || 'User'}</div>
              <div class="message">"${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}"</div>
              <div class="date">${formatDate(msg.created_at)}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${newMatches.length > 0 ? `
        <div class="section">
          <h2>新しいマッチ <span class="badge">${newMatches.length}</span></h2>
          ${newMatches.map(match => {
            const otherUser = match.user1_id === userId ? match.user2 : match.user1;
            return `
              <div class="item">
                <span class="name">${otherUser.first_name || 'User'}</span>さんとマッチしました！
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
      
      ${newEvents.length > 0 ? `
        <div class="section">
          <h2>新しいイベント <span class="badge">${newEvents.length}</span></h2>
          ${newEvents.map(event => `
            <div class="event">
              <div class="event-title">${event.title}</div>
              <div>${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</div>
              <div class="date">開催日: ${formatDate(event.date)}</div>
              <div>場所: ${event.location}</div>
              ${event.creator ? `<div>主催者: ${event.creator.first_name || 'User'}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${upcomingEvents.length > 0 ? `
        <div class="section">
          <h2>3日以内に開催されるイベント <span class="badge">${upcomingEvents.length}</span></h2>
          ${upcomingEvents.map(event => `
            <div class="event">
              <div class="event-title">${event.title}</div>
              <div>${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</div>
              <div class="date">開催日: ${formatDate(event.date)}</div>
              <div>場所: ${event.location}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="divider"></div>
      
      <p>アプリにログインして詳細を確認し、友達とのつながりを深めましょう！</p>
      
      <div class="footer">
        <p>このメールは通知設定に基づいて送信されています。<br>
        通知設定の変更は、アプリのプロフィール設定から行えます。</p>
      </div>
    </body>
    </html>
  `;

  // Send the email using Resend
  const { data, error } = await resend.emails.send({
    from: "DAP Notification <notifications@resend-domain.com>",  // Update with your verified domain
    to: email,
    subject: `${username}さんの DAP デイリーアップデート`,
    html: htmlContent,
  });

  if (error) {
    console.error(`Error sending email to ${email}:`, error);
    throw error;
  }

  console.log(`Successfully sent digest email to ${email}`, data);
}

// Start the HTTP server
serve(handler);
