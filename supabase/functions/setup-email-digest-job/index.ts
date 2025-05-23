
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Execute SQL function to set up the cron job
    const { data, error } = await supabase.rpc('setup_email_digest_job');
    
    if (error) throw error;
    
    // Also manually invoke the send-daily-digest function once to verify it works
    const testResponse = await supabase.functions.invoke("send-daily-digest", {
      body: { test: true }
    });
    
    let responseMessage = "Email digest job successfully configured to run at 7:00 AM JST daily";
    if (testResponse.data?.success) {
      responseMessage += ". A test run was also executed successfully.";
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: responseMessage,
        testRunResult: testResponse.data
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
      }
    );
  } catch (error) {
    console.error("Error setting up email digest job:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
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
