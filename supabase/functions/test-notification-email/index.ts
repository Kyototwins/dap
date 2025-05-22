
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const brevoApiKey = Deno.env.get("BREVO_API_KEY") as string;

if (!supabaseUrl) {
  console.error("SUPABASE_URL environment variable is not set");
}

if (!supabaseServiceKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY environment variable is not set");
}

if (!brevoApiKey) {
  console.error("BREVO_API_KEY environment variable is not set");
}

console.log("Environment variables check completed");
console.log("SUPABASE_URL exists:", !!supabaseUrl);
console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!supabaseServiceKey);
console.log("BREVO_API_KEY exists:", !!brevoApiKey);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Generate email HTML content for test
 */
function generateTestEmailContent(username: string, emailAddress: string): string {
  return `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h1 style="color: #5640AA;">Test Notification Email</h1>
      <p>Hello ${username}!</p>
      
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p>This is a <strong>test notification email</strong> from Language Connect.</p>
        <p>If you received this email, it means that your notification email settings are working correctly.</p>
        <p>Time sent: ${new Date().toISOString()}</p>
        <p>Target email address: ${emailAddress}</p>
      </div>
      
      <p>Your notification email settings:</p>
      <ul>
        <li>Email delivery: <strong>Enabled</strong></li>
        <li>You're receiving this at: <strong>${emailAddress}</strong></li>
      </ul>
      
      <p style="margin-top: 30px; font-size: 14px; color: #777;">
        This is a test email to verify that notifications are working correctly.<br>
        これはテストメールで、通知が正しく動作していることを確認するためのものです。
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
async function sendBrevoEmail(email: string, username: string) {
  if (!brevoApiKey) {
    throw new Error("BREVO_API_KEY is not set. Unable to send email.");
  }

  try {
    console.log(`Attempting to send test email to ${email} for user ${username}`);
    
    const emailData = {
      sender: {
        name: "DAP",
        email: "notifications@dapsince2025.com",  // Updated sender email domain
      },
      to: [{ email }],
      subject: "Test Notification - Language Connect",
      htmlContent: generateTestEmailContent(username, email),
    };
    
    console.log("Email payload prepared:", JSON.stringify(emailData));
    
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify(emailData),
    });
    
    const responseStatus = response.status;
    const responseBody = await response.text();
    
    console.log(`Brevo API response status: ${responseStatus}`);
    console.log(`Brevo API response body: ${responseBody}`);
    
    // Check if response is in expected format
    let parsedBody;
    try {
      if (responseBody) {
        parsedBody = JSON.parse(responseBody);
      }
    } catch (e) {
      console.error("Failed to parse response body:", e);
      console.log("Raw response body:", responseBody);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to send email: ${responseStatus} ${responseBody}`);
    }
    
    return parsedBody || { message: "Email sent successfully but no response body" };
  } catch (error) {
    console.error("Error sending test email:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Test notification email function triggered");
    
    // Parse the request body to get the user ID
    const requestData = await req.json();
    const { userId, email } = requestData;
    
    console.log(`Request received with userId: ${userId}, email: ${email || 'not provided'}`);
    console.log("Full request data:", JSON.stringify(requestData));
    
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "User ID is required" }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          },
        }
      );
    }
    
    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name, notification_email, email_digest_enabled")
      .eq("id", userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      throw profileError;
    }

    console.log("Profile retrieved:", profile);
    
    // Get user's auth email if not provided
    let userEmail = email;
    if (!userEmail) {
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError) {
        console.error("Error fetching user auth data:", userError);
        throw userError;
      }
      
      console.log("Auth user data retrieved:", user);
      
      userEmail = profile.notification_email || user?.email;
      
      if (!userEmail) {
        throw new Error("Could not find an email address for this user");
      }
    }
    
    console.log(`Using email address for notifications: ${userEmail}`);
    
    const username = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || userEmail;
    
    // Send the test email
    const result = await sendBrevoEmail(userEmail, username);
    
    console.log("Email sent successfully:", result);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Test notification email sent to ${userEmail}`,
        result 
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
    console.error("Error sending test notification email:", error);
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
