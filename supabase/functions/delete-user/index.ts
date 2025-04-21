
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Delete user (auth info only) function called");
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(JSON.stringify({ success: false, error: "Missing 'user_id'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get service role key for admin operations
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceRoleKey) {
      return new Response(JSON.stringify({ success: false, error: "Service role key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = "https://yxacicvkyusnykivbmtg.supabase.co";
    console.log(`Attempting to delete auth user with ID: ${user_id}`);

    // Use the Auth Admin API to delete the user
    const res = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users/${user_id}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${serviceRoleKey}`,
          "apikey": serviceRoleKey,
          "Content-Type": "application/json"
        },
      }
    );

    const responseStatus = res.status;
    console.log(`Auth delete response status: ${responseStatus}`);
    
    let responseText;
    try {
      responseText = await res.text();
      console.log(`Auth delete response body: ${responseText}`);
    } catch (e) {
      console.error("Error reading response:", e);
      responseText = "Could not read response";
    }

    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("Error parsing response:", e);
      responseData = { message: responseText };
    }

    if (!res.ok) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: responseData,
        statusCode: res.status,
        statusText: res.statusText
      }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: "User authentication successfully deleted. Profile data remains intact."
    }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Error in delete-user function (auth only):", err);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: err.message || 'Unknown error',
        stack: err.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
}, { port: 3000 });
