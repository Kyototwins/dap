
import { PushNotificationSettings } from "./PushNotificationSettings";
import { InAppNotificationSettings } from "./InAppNotificationSettings";

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      {/* Push Notification Settings */}
      <PushNotificationSettings />
      
      {/* In-App Notification Settings */}
      <InAppNotificationSettings />
    </div>
  );
}
