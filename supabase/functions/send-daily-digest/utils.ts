
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Convert a Date to JST (Japan Standard Time)
 */
export function toJST(date: Date): Date {
  // JST is UTC+9
  return new Date(date.getTime() + (9 * 60 * 60 * 1000));
}

/**
 * Convert a Date to ISO string in JST timezone
 */
export function toJSTISOString(date: Date): string {
  const jstDate = toJST(date);
  return jstDate.toISOString();
}
