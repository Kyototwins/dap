import { supabase } from "@/integrations/supabase/client";

// Function to send a push notification
export const sendPushNotification = async (
  fcmToken: string,
  title: string,
  body: string,
  data?: any
) => {
  const message = {
    to: fcmToken,
    notification: {
      title,
      body,
    },
    data: data,
  };

  try {
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY}`,
      },
      body: JSON.stringify(message),
    });

    const responseData = await response.json();
    console.log("FCM Response:", responseData);

    if (responseData.failure > 0) {
      console.error("FCM Error:", responseData.results);
      return { error: "Failed to send push notification" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { error };
  }
};

// Update FCM token in user profile
export const updateFcmToken = async (token: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase
      .from("profiles")
      .update({ fcm_token: token })
      .eq("id", user.id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating FCM token:", error);
    return { error };
  }
};

// Get FCM token from user profile
export const getFcmToken = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("fcm_token")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return { token: data?.fcm_token || null };
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return { error };
  }
};
