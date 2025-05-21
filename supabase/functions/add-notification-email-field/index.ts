
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Check if notification_email column exists
    const { data: columnExists, error: checkError } = await supabase
      .from('profiles')
      .select('notification_email')
      .limit(1)
      .maybeSingle();

    // If we get a "column does not exist" error, we need to add it
    if (checkError && checkError.message.includes('column "notification_email" does not exist')) {
      // Add notification_email column
      const { error: alterError } = await supabase.rpc('add_notification_email_field');
      
      if (alterError) {
        console.error("Error adding notification_email field:", alterError);
        throw alterError;
      }
      
      return new Response(
        JSON.stringify({ success: true, message: "Added notification_email field to profiles table" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }
    
    // Column already exists
    return new Response(
      JSON.stringify({ success: true, message: "notification_email field already exists" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
