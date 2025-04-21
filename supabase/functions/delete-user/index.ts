
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

    // 認証情報削除用のサービスロールキー取得
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceRoleKey) {
      return new Response(JSON.stringify({ success: false, error: "Service role key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Delete only auth.users for user: ${user_id}`);

    // SupabaseのAdmin APIでusersのみ削除
    const res = await fetch(
      `https://yxacicvkyusnykivbmtg.supabase.co/auth/v1/admin/users/${user_id}`,
      {
        method: "DELETE",
        headers: {
          "apiKey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json"
        },
      }
    );

    const responseStatus = res.status;
    const responseBody = await res.text();
    console.log(`Supabase delete user response - Status: ${responseStatus}, Body: ${responseBody}`);

    let responseData;
    try {
      responseData = JSON.parse(responseBody);
    } catch {
      responseData = { message: responseBody };
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

    return new Response(JSON.stringify({ success: true }), { 
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
