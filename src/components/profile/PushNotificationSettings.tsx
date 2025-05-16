
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { BellRing } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export function PushNotificationSettings() {
  const [loading, setLoading] = useState(false);
  const { isSupported, isEnabled, isInitializing, initializeNotifications } = usePushNotifications();

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      const success = await initializeNotifications();
      if (success) {
        toast({
          title: "プッシュ通知が有効になりました",
          description: "通知を受け取るようになりました。",
        });
      } else {
        toast({
          title: "プッシュ通知の有効化に失敗しました",
          description: "通知権限を許可してください。",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast({
        title: "エラーが発生しました",
        description: "プッシュ通知を有効にできませんでした。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            プッシュ通知
          </CardTitle>
          <CardDescription>
            デバイスに直接通知を送信します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
            お使いのブラウザはプッシュ通知に対応していません。Chrome、Firefox、Edgeなどの最新のブラウザをご利用ください。
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          プッシュ通知
        </CardTitle>
        <CardDescription>
          デバイスに直接通知を送信します
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="push-notifications" className="flex flex-col gap-1">
            <span>プッシュ通知を有効にする</span>
            <span className="font-normal text-sm text-muted-foreground">
              ブラウザを閉じている時でも通知を受け取ることができます
            </span>
          </Label>
          <Switch
            id="push-notifications"
            disabled={loading || isInitializing}
            checked={isEnabled}
            onCheckedChange={(checked) => {
              if (checked && !isEnabled) {
                handleEnableNotifications();
              }
            }}
          />
        </div>
        
        <Separator />
        
        <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
          <p>通知を許可すると、新しいメッセージやマッチング、イベントのお知らせなどをリアルタイムで受け取れます。</p>
          <p className="mt-2">デバイスの設定でブラウザの通知がオフになっている場合は、デバイスの設定から通知を許可してください。</p>
        </div>
      </CardContent>
      {!isEnabled && (
        <CardFooter>
          <Button 
            onClick={handleEnableNotifications} 
            disabled={loading || isInitializing}
            className="w-full"
          >
            {loading || isInitializing ? "設定中..." : "プッシュ通知を有効にする"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

