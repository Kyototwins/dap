
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { toJSTISOString } from "./utils.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface ActivitySummary {
  likesReceived: number;
  messagesReceived: number;
  newEvents: Array<{title: string; date: string}>;
  eventParticipations: number;
  eventComments: number;
  newAccounts: number;
  totalMatches: number;
}

/**
 * Query for likes received yesterday for a specific user
 */
async function getLikesReceived(userId: string, yesterdayStart: string, todayStart: string) {
  const { data, error } = await supabase
    .from("matches")
    .select("id")
    .eq("user2_id", userId)
    .eq("status", "matched")
    .gte("created_at", yesterdayStart)
    .lt("created_at", todayStart);
  
  if (error) {
    console.error("Error fetching likes:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Query for messages received yesterday for a specific user
 */
async function getMessagesReceived(userId: string, yesterdayStart: string, todayStart: string) {
  // Get messages received yesterday
  const { data: messagesData, error: messagesError } = await supabase
    .from("messages")
    .select("id, match_id, sender_id")
    .neq("sender_id", userId)
    .gte("created_at", yesterdayStart)
    .lt("created_at", todayStart);
  
  if (messagesError) {
    console.error("Error fetching messages:", messagesError);
    return [];
  }
  
  // Get user's matches
  const { data: userMatches, error: matchesError } = await supabase
    .from("matches")
    .select("id")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);
  
  if (matchesError) {
    console.error("Error fetching matches:", matchesError);
    return [];
  }
  
  // Filter messages to only include those from the user's matches
  const userMatchIds = userMatches?.map(match => match.id) || [];
  return (messagesData || []).filter(msg => userMatchIds.includes(msg.match_id));
}

/**
 * Query for new events created yesterday
 */
async function getNewEvents(yesterdayStart: string, todayStart: string) {
  const { data, error } = await supabase
    .from("events")
    .select("title, date")
    .gte("created_at", yesterdayStart)
    .lt("created_at", todayStart);
  
  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Query for participations in user's events from yesterday
 */
async function getEventParticipations(userId: string, yesterdayStart: string, todayStart: string) {
  // Get user's events
  const { data: userEvents, error: userEventsError } = await supabase
    .from("events")
    .select("id")
    .eq("creator_id", userId);
  
  if (userEventsError) {
    console.error("Error fetching user events:", userEventsError);
    return [];
  }
  
  const userEventIds = userEvents?.map(event => event.id) || [];
  
  // Get participations for user's events from yesterday
  const { data, error } = await supabase
    .from("event_participants")
    .select("id")
    .in("event_id", userEventIds)
    .gte("created_at", yesterdayStart)
    .lt("created_at", todayStart);
  
  if (error) {
    console.error("Error fetching participations:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Query for comments on user's events from yesterday
 */
async function getEventComments(userId: string, yesterdayStart: string, todayStart: string) {
  // Get user's events
  const { data: userEvents, error: userEventsError } = await supabase
    .from("events")
    .select("id")
    .eq("creator_id", userId);
  
  if (userEventsError) {
    console.error("Error fetching user events:", userEventsError);
    return [];
  }
  
  const userEventIds = userEvents?.map(event => event.id) || [];
  
  // Get comments for user's events from yesterday
  const { data, error } = await supabase
    .from("event_comments")
    .select("id")
    .in("event_id", userEventIds)
    .gte("created_at", yesterdayStart)
    .lt("created_at", todayStart);
  
  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Query for new accounts created yesterday
 */
async function getNewAccounts(yesterdayStart: string, todayStart: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .gte("created_at", yesterdayStart)
    .lt("created_at", todayStart);
  
  if (error) {
    console.error("Error fetching new accounts:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Get total number of matches for a user
 */
async function getTotalMatches(userId: string) {
  const { data, error } = await supabase
    .from("matches")
    .select("id")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .in("status", ["matched", "pending"]);
  
  if (error) {
    console.error("Error fetching total matches:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Get activity summary for a specific user for yesterday
 */
export async function getYesterdayActivity(userId: string): Promise<ActivitySummary> {
  console.log(`Getting yesterday's activity for user ${userId}`);
  
  // Get yesterday's date in JST (start of day)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setUTCHours(0, 0, 0, 0); // This is UTC time
  const yesterdayJST = toJSTISOString(yesterday);
  
  // Get today's date in JST (start of day)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // This is UTC time
  const todayJST = toJSTISOString(today);
  
  console.log(`Date range for activity: ${yesterdayJST} to ${todayJST}`);
  
  const likes = await getLikesReceived(userId, yesterdayJST, todayJST);
  const messages = await getMessagesReceived(userId, yesterdayJST, todayJST);
  const newEvents = await getNewEvents(yesterdayJST, todayJST);
  const participations = await getEventParticipations(userId, yesterdayJST, todayJST);
  const comments = await getEventComments(userId, yesterdayJST, todayJST);
  const newAccounts = await getNewAccounts(yesterdayJST, todayJST);
  const totalMatches = await getTotalMatches(userId);
  
  console.log(`Activity summary for user ${userId}: likes=${likes.length}, messages=${messages.length}, events=${newEvents.length}, participations=${participations.length}, comments=${comments.length}, newAccounts=${newAccounts.length}, totalMatches=${totalMatches.length}`);
  
  return {
    likesReceived: likes.length || 0,
    messagesReceived: messages.length || 0,
    newEvents: newEvents || [],
    eventParticipations: participations.length || 0,
    eventComments: comments.length || 0,
    newAccounts: newAccounts.length || 0,
    totalMatches: totalMatches.length || 0,
  };
}
