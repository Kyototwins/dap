
// Follow this setup guide to integrate the Deno runtime into your project:
// https://docs.supabase.com/guides/functions/deno-runtime#getting-started
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface NotificationPayload {
  token: string;
  title: string;
  body: string;
  image?: string;
  data?: Record<string, string>;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Get the Firebase Server Key from secrets
    const FCM_SERVER_KEY = Deno.env.get("FCM_SERVER_KEY");
    if (!FCM_SERVER_KEY) {
      throw new Error("FCM_SERVER_KEY is not set in the environment variables");
    }
    
    // Parse request body
    const payload = await req.json() as NotificationPayload;
    
    if (!payload.token) {
      throw new Error("FCM token is required");
    }
    
    if (!payload.title || !payload.body) {
      throw new Error("Notification title and body are required");
    }
    
    // Prepare FCM message
    const fcmMessage = {
      to: payload.token,
      notification: {
        title: payload.title,
        body: payload.body,
        image: payload.image,
      },
      data: payload.data || {},
    };
    
    // Send to FCM
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `key=${FCM_SERVER_KEY}`,
      },
      body: JSON.stringify(fcmMessage),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(`FCM request failed: ${JSON.stringify(responseData)}`);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        data: responseData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

