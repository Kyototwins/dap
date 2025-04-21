
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { user_id, service_role_key } = await req.json()

    if (!user_id) {
      return new Response(JSON.stringify({ error: "Missing 'user_id'" }), {
        status: 400,
        headers: corsHeaders,
      })
    }
    if (!service_role_key) {
      return new Response(JSON.stringify({ error: "Missing 'service_role_key'" }), {
        status: 401,
        headers: corsHeaders,
      })
    }

    // Supabase Admin APIでユーザー削除
    const { default: fetch } = await import('node-fetch');
    const res = await fetch(
      `https://yxacicvkyusnykivbmtg.supabase.co/auth/v1/admin/users/${user_id}`,
      {
        method: "DELETE",
        headers: {
          apiKey: service_role_key,
          Authorization: `Bearer ${service_role_key}`,
        },
      }
    )
    if (!res.ok) {
      const errorData = await res.json()
      return new Response(JSON.stringify({ error: errorData }), {
        status: 500,
        headers: corsHeaders,
      })
    }

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Unknown error' }),
      { status: 500, headers: corsHeaders }
    )
  }
}, { port: 3000 })
