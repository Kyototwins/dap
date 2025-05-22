
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { EmailDigestToggle } from "./notifications/EmailDigestToggle";
import { NotificationEmailSection } from "./notifications/NotificationEmailSection";
import { TestEmailSection } from "./notifications/TestEmailSection";
import { useNotificationSettings } from "./notifications/useNotificationSettings";

interface NotificationSettingsProps {
  emailDigestEnabled: boolean;
  notificationEmail: string;
  defaultEmail: string; // The email from auth - used as fallback
  onUpdateSettings: (emailDigestEnabled: boolean, notificationEmail?: string) => Promise<void>;
}

export function NotificationSettings({ 
  emailDigestEnabled, 
  notificationEmail,
  defaultEmail,
  onUpdateSettings 
}: NotificationSettingsProps) {
  const {
    enabled,
    email,
    isCustomEmail,
    loading,
    isEditing,
    testEmailSending,
    setEmail,
    setIsEditing,
    handleToggleNotifications,
    handleSaveEmail,
    handleToggleCustomEmail,
    sendTestEmail
  } = useNotificationSettings({
    emailDigestEnabled,
    notificationEmail,
    defaultEmail,
    onUpdateSettings
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Bell className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Notification Settings</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        <EmailDigestToggle 
          enabled={enabled}
          loading={loading}
          onToggle={handleToggleNotifications}
        />
        
        <div className="space-y-3 pt-2 border-t">
          <NotificationEmailSection
            email={email}
            isCustomEmail={isCustomEmail}
            isEditing={isEditing}
            loading={loading}
            onEmailChange={setEmail}
            onCustomToggle={handleToggleCustomEmail}
            onSaveEmail={handleSaveEmail}
            onEditToggle={setIsEditing}
          />
        </div>

        {/* Test email section */}
        <div className="pt-4 border-t">
          <TestEmailSection
            enabled={enabled}
            sending={testEmailSending}
            onSendTest={sendTestEmail}
          />
        </div>
      </CardContent>
    </Card>
  );
}
