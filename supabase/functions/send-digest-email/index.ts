
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationDigest {
  userId: string;
  email: string;
  firstName: string;
  unreadMessages: number;
  newMatches: number;
  eventInvites: number;
}

// Create a single Supabase client for interacting with your database
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

async function sendEmail(digest: NotificationDigest) {
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  
  if (!SENDGRID_API_KEY) {
    throw new Error("Missing SendGrid API key");
  }

  const url = "https://api.sendgrid.com/v3/mail/send";
  
  // Create the email content
  const emailContent = {
    personalizations: [
      {
        to: [{ email: digest.email }],
        subject: `GlobalPals Daily Update for ${digest.firstName}`,
      },
    ],
    from: { email: "noreply@globalpals.app", name: "GlobalPals" },
    content: [
      {
        type: "text/html",
        value: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4F46E5;">Hello ${digest.firstName}!</h2>
            <p>Here's your daily update from GlobalPals:</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              ${digest.unreadMessages > 0 ? 
                `<p>📩 You have <strong>${digest.unreadMessages}</strong> unread message${digest.unreadMessages > 1 ? 's' : ''}.</p>` : ''}
              
              ${digest.newMatches > 0 ? 
                `<p>🤝 You have <strong>${digest.newMatches}</strong> new match${digest.newMatches > 1 ? 'es' : ''}!</p>` : ''}
              
              ${digest.eventInvites > 0 ? 
                `<p>🎉 You've been invited to <strong>${digest.eventInvites}</strong> event${digest.eventInvites > 1 ? 's' : ''}.</p>` : ''}
              
              ${(digest.unreadMessages === 0 && digest.newMatches === 0 && digest.eventInvites === 0) ?
                `<p>No new notifications today. Check back tomorrow!</p>` : ''}
            </div>
            
            <p><a href="https://globalpals.lovable.app" style="color: #4F46E5; text-decoration: none; font-weight: bold;">Visit GlobalPals</a> to see more details.</p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This is an automated message. Please do not reply to this email.<br>
              To manage your notification preferences, visit your <a href="https://globalpals.lovable.app/profile" style="color: #4F46E5;">profile settings</a>.
            </p>
          </div>
        `,
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify(emailContent),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SendGrid API error:", errorText);
      throw new Error(`SendGrid API error: ${response.status} ${errorText}`);
    }

    return { success: true, email: digest.email };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

async function generateDigests(): Promise<NotificationDigest[]> {
  // Get users who have email notifications enabled
  const { data: users, error: usersError } = await supabaseClient
    .from("profiles")
    .select("id, first_name, email_notifications")
    .eq("email_notifications", true);

  if (usersError) {
    console.error("Error fetching users:", usersError);
    throw usersError;
  }

  const digests: NotificationDigest[] = [];

  for (const user of users) {
    // Get user email from auth table
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("email")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      console.error(`Error fetching email for user ${user.id}:`, userError);
      continue;
    }

    // Count unread messages
    const { count: unreadMessages, error: messagesError } = await supabaseClient
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("receiver_id", user.id)
      .eq("read", false);

    if (messagesError) {
      console.error(`Error counting messages for user ${user.id}:`, messagesError);
    }

    // Count new matches (created in the last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const { count: newMatches, error: matchesError } = await supabaseClient
      .from("matches")
      .select("*", { count: "exact", head: true })
      .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
      .gte("created_at", oneDayAgo.toISOString());

    if (matchesError) {
      console.error(`Error counting matches for user ${user.id}:`, matchesError);
    }

    // Count event invites
    const { count: eventInvites, error: eventsError } = await supabaseClient
      .from("event_invitations")
      .select("*", { count: "exact", head: true })
      .eq("invitee_id", user.id)
      .eq("status", "pending");

    if (eventsError) {
      console.error(`Error counting event invites for user ${user.id}:`, eventsError);
    }

    // Only add to digest if there are notifications to send
    if ((unreadMessages || 0) > 0 || (newMatches || 0) > 0 || (eventInvites || 0) > 0) {
      digests.push({
        userId: user.id,
        email: userData.email,
        firstName: user.first_name || "User",
        unreadMessages: unreadMessages || 0,
        newMatches: newMatches || 0,
        eventInvites: eventInvites || 0,
      });
    }
  }

  return digests;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting digest email generation");
    const digests = await generateDigests();
    console.log(`Generated ${digests.length} digests`);

    const results = [];
    for (const digest of digests) {
      try {
        console.log(`Sending digest to ${digest.email}`);
        const result = await sendEmail(digest);
        results.push(result);
      } catch (error) {
        console.error(`Error sending digest to ${digest.email}:`, error);
        results.push({ success: false, email: digest.email, error: error.message });
      }
    }

    return new Response(JSON.stringify({ sent: results.length, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-digest-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

// Start the server
serve(handler);
