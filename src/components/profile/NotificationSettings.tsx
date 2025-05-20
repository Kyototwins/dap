
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NotificationSettingsProps {
  emailDigestEnabled: boolean;
  onUpdateSettings: (emailDigestEnabled: boolean) => Promise<void>;
}

export function NotificationSettings({ 
  emailDigestEnabled, 
  onUpdateSettings 
}: NotificationSettingsProps) {
  const [enabled, setEnabled] = useState(emailDigestEnabled);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get user email from auth session
    const getUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    };
    
    getUserEmail();
  }, []);

  const handleToggleNotifications = async () => {
    setLoading(true);
    try {
      const newState = !enabled;
      await onUpdateSettings(newState);
      setEnabled(newState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Bell className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Daily Notifications</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">Daily Digest Email</h3>
            <p className="text-sm text-muted-foreground">
              Receive a daily summary of your activity at 7:00 AM
            </p>
            {userEmail && (
              <p className="text-sm text-muted-foreground">
                Email will be sent to: <span className="font-medium">{userEmail}</span>
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={enabled}
              onCheckedChange={handleToggleNotifications}
              disabled={loading}
            />
            <Label htmlFor="daily-digest">{enabled ? "On" : "Off"}</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
