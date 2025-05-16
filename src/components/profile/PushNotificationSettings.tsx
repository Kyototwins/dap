
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { updateFcmToken } from "@/services/profileService";

export function PushNotificationSettings() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("default");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if push notifications are supported
  const isPushSupported = () => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  };

  // Check current permission status
  useEffect(() => {
    if (!isPushSupported()) return;
    
    setPermissionStatus(Notification.permission);
    
    // If notifications are allowed, set the switch to on
    if (Notification.permission === 'granted') {
      setPushEnabled(true);
    }
  }, []);

  const handleTogglePushNotifications = async (enabled: boolean) => {
    if (!isPushSupported() || !user) {
      toast({
        title: "Notification Error",
        description: "Push notifications are not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (enabled) {
        // Request permission
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        
        if (permission !== 'granted') {
          toast({
            title: "Notification Permission",
            description: "Notification permission was not granted. Please check your browser settings.",
            variant: "destructive",
          });
          setPushEnabled(false);
          setLoading(false);
          return;
        }
        
        // Save FCM token if permission was granted
        const success = await updateFcmToken(user.id, "test-fcm-token");
        
        if (!success) {
          toast({
            title: "Settings Error",
            description: "Failed to update notification settings.",
            variant: "destructive",
          });
          setPushEnabled(false);
        } else {
          setPushEnabled(true);
          toast({
            title: "Settings Updated",
            description: "Push notifications have been enabled.",
          });
        }
      } else {
        // Disable notifications by clearing FCM token
        const success = await updateFcmToken(user.id, "");
        
        if (!success) {
          toast({
            title: "Settings Error",
            description: "Failed to update notification settings.",
            variant: "destructive",
          });
        } else {
          setPushEnabled(false);
          toast({
            title: "Settings Updated",
            description: "Push notifications have been disabled.",
          });
        }
      }
    } catch (error) {
      console.error("Push notification error:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating notification settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Receive important notifications as push notifications on your device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isPushSupported() ? (
          <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
            Your browser does not support push notifications.
          </div>
        ) : (
          <div className="flex items-center justify-between space-y-0 rounded-md border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <div className="text-sm text-muted-foreground">
                {permissionStatus === 'granted' 
                  ? 'Push notifications are enabled' 
                  : 'Enable push notifications'}
              </div>
            </div>
            <Switch
              id="push-notifications"
              disabled={loading || permissionStatus === "denied"}
              checked={pushEnabled}
              onCheckedChange={handleTogglePushNotifications}
            />
          </div>
        )}
        
        {permissionStatus === "denied" && (
          <div className="p-4 bg-amber-50 text-amber-800 rounded-md text-sm">
            Notifications are blocked by your browser. To enable notifications, please update your browser settings.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
