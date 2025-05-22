
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendBrevoEmail } from "./email-utils.ts";
import { corsHeaders } from "./constants.ts";

// Initialize environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const brevoApiKey = Deno.env.get("BREVO_API_KEY") as string;

// Validate required environment variables
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

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const result = await sendBrevoEmail(userEmail, username, brevoApiKey);
    
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
