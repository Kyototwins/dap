
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PushNotificationSettings } from "./PushNotificationSettings";
import { EmailNotificationSettings } from "./EmailNotificationSettings";
import { InAppNotificationSettings } from "./InAppNotificationSettings";

export function NotificationSettings() {
  const [loading, setLoading] = useState(false);
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");

  // Load user's current notification settings
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching notification settings:", error);
          return;
        }
        
        if (data) {
          // Safely access properties that may not exist in all database setups
          setEmailDigestEnabled(data.email_digest_enabled || false);
          setNotificationEmail(data.notification_email || user.email || "");
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingsSaved = () => {
    // Refresh settings if needed
  };

  return (
    <div className="space-y-6">
      {/* Push Notification Settings */}
      <PushNotificationSettings />
      
      {/* Email Notification Settings */}
      <EmailNotificationSettings 
        emailDigestEnabled={emailDigestEnabled}
        notificationEmail={notificationEmail}
        onSave={handleSettingsSaved}
      />
      
      {/* In-App Notification Settings */}
      <InAppNotificationSettings />
    </div>
  );
}
