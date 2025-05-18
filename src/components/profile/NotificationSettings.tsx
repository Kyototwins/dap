
import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { supabase } from '@/integrations/supabase/client';

export function NotificationSettings() {
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { 
    isSupported, 
    permission, 
    enableNotifications, 
    disableNotifications, 
    loading 
  } = usePushNotifications();

  // Check current notification status when component mounts
  useEffect(() => {
    const checkNotificationStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Use raw query result to handle potential missing column
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          // Access fcm_token safely with type assertion
          const hasToken = !!(data && data.fcm_token);
          setNotificationsEnabled(hasToken);
        }
      } catch (error) {
        console.error('Error checking notification status:', error);
      } finally {
        setNotificationsLoading(false);
      }
    };

    checkNotificationStatus();
  }, []);

  // Handle toggle
  const handleToggleNotifications = async () => {
    if (notificationsEnabled) {
      const success = await disableNotifications();
      if (success) {
        setNotificationsEnabled(false);
      }
    } else {
      const success = await enableNotifications();
      if (success) {
        setNotificationsEnabled(true);
      }
    }
  };

  // If notifications are not supported, don't show anything
  if (!isSupported) {
    return null;
  }

  return (
    <Card className="mb-6 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <Bell className="mr-2 h-5 w-5 text-doshisha-purple" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="notifications" className="font-medium">
              Push Notifications
            </Label>
            <span className="text-sm text-gray-500">
              {notificationsEnabled 
                ? "You'll receive notifications for new messages and matches"
                : "Enable notifications to stay updated"}
            </span>
          </div>
          <Switch
            id="notifications"
            checked={notificationsEnabled === true}
            disabled={loading || notificationsLoading}
            onCheckedChange={handleToggleNotifications}
          />
        </div>
      </CardContent>
    </Card>
  );
}
