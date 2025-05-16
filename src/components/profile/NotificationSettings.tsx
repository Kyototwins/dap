
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PushNotificationSettings } from "./PushNotificationSettings";
import { InAppNotificationSettings } from "./InAppNotificationSettings";

export function NotificationSettings() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      {/* Push Notification Settings */}
      <PushNotificationSettings />
      
      {/* In-App Notification Settings */}
      <InAppNotificationSettings />
    </div>
  );
}
