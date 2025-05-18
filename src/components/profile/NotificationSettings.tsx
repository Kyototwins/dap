
import { useEffect, useState } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BellRing, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function NotificationSettings() {
  const { 
    isSupported, 
    permission, 
    loading, 
    enableNotifications, 
    disableNotifications 
  } = usePushNotifications();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Check if user has FCM token in profile
  useEffect(() => {
    const checkTokenExists = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('fcm_token')
        .eq('id', user.id)
        .single();
        
      if (!error && data && data.fcm_token) {
        setNotificationsEnabled(true);
      } else {
        setNotificationsEnabled(false);
      }
    };
    
    checkTokenExists();
  }, []);

  // Handle toggle change
  const handleToggleNotifications = async (checked: boolean) => {
    if (checked) {
      const success = await enableNotifications();
      setNotificationsEnabled(success);
    } else {
      const success = await disableNotifications();
      setNotificationsEnabled(!success);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          通知設定
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isSupported === false && (
          <div className="bg-amber-100 p-4 rounded-md flex items-center gap-2 text-amber-800 text-sm">
            <Info className="h-5 w-5 flex-shrink-0" />
            <p>お使いのブラウザはプッシュ通知をサポートしていません。</p>
          </div>
        )}

        {isSupported && (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="notifications" className="font-medium">
                プッシュ通知
              </Label>
              <p className="text-sm text-gray-500">
                新しいメッセージやいいね、イベントの通知を受け取る
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={handleToggleNotifications}
              disabled={loading || isSupported === false}
            />
          </div>
        )}

        {permission === 'denied' && (
          <div className="bg-red-100 p-4 rounded-md text-sm text-red-800">
            <p className="font-medium mb-1">通知がブロックされています</p>
            <p>ブラウザの設定から通知を許可してください。</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.open('https://support.google.com/chrome/answer/3220216?hl=ja', '_blank')}
            >
              設定方法を確認
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
