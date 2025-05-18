
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
        title: "通知エラー",
        description: "プッシュ通知はこのブラウザではサポートされていません。",
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
            title: "通知許可",
            description: "通知権限が許可されていません。ブラウザの設定を確認してください。",
            variant: "destructive",
          });
          setPushEnabled(false);
          setLoading(false);
          return;
        }
        
        // Save FCM token if permission was granted
        // This is where we would register with Firebase and get a token
        // For now, we'll use a placeholder
        const success = await updateFcmToken(user.id, "test-fcm-token");
        
        if (!success) {
          toast({
            title: "設定エラー",
            description: "通知設定の更新に失敗しました。",
            variant: "destructive",
          });
          setPushEnabled(false);
        } else {
          setPushEnabled(true);
          toast({
            title: "設定完了",
            description: "プッシュ通知が有効になりました。",
          });
        }
      } else {
        // Disable notifications by clearing FCM token
        const success = await updateFcmToken(user.id, "");
        
        if (!success) {
          toast({
            title: "設定エラー",
            description: "通知設定の更新に失敗しました。",
            variant: "destructive",
          });
        } else {
          setPushEnabled(false);
          toast({
            title: "設定完了",
            description: "プッシュ通知が無効になりました。",
          });
        }
      }
    } catch (error) {
      console.error("Push notification error:", error);
      toast({
        title: "エラー",
        description: "通知設定の更新中にエラーが発生しました。",
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
          プッシュ通知
        </CardTitle>
        <CardDescription>
          重要な通知をデバイスにプッシュ通知として受け取る設定
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isPushSupported() ? (
          <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
            お使いのブラウザはプッシュ通知をサポートしていません。
          </div>
        ) : (
          <div className="flex items-center justify-between space-y-0 rounded-md border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">プッシュ通知</Label>
              <div className="text-sm text-muted-foreground">
                {permissionStatus === 'granted' 
                  ? 'プッシュ通知は有効です' 
                  : 'プッシュ通知を有効にする'}
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
            通知がブラウザで拒否されています。通知を有効にするにはブラウザの設定から許可してください。
          </div>
        )}
      </CardContent>
    </Card>
  );
}
