
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface NotificationSettingsProps {
  emailDigestEnabled: boolean;
  notificationEmail: string;
  defaultEmail: string; // The email from auth - used as fallback
  notificationTime?: string;
  onUpdateSettings: (emailDigestEnabled: boolean, notificationEmail?: string, notificationTime?: string) => Promise<void>;
}

export function NotificationSettings({ 
  emailDigestEnabled, 
  notificationEmail,
  defaultEmail,
  notificationTime = "09:00",
  onUpdateSettings 
}: NotificationSettingsProps) {
  const [enabled, setEnabled] = useState(emailDigestEnabled);
  const [email, setEmail] = useState(notificationEmail || defaultEmail);
  const [isCustomEmail, setIsCustomEmail] = useState(!!notificationEmail && notificationEmail !== defaultEmail);
  const [time, setTime] = useState(notificationTime);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Update email when props change
    setEmail(notificationEmail || defaultEmail);
    setIsCustomEmail(!!notificationEmail && notificationEmail !== defaultEmail);
    setTime(notificationTime || "09:00");
  }, [notificationEmail, defaultEmail, notificationTime]);

  const handleToggleNotifications = async () => {
    setLoading(true);
    try {
      const newState = !enabled;
      await onUpdateSettings(newState, isCustomEmail ? email : undefined, time);
      setEnabled(newState);
      toast({
        title: newState ? "通知が有効化されました" : "通知が無効化されました",
        description: newState ? "毎日のダイジェストメールが送信されます" : "通知はオフになりました",
      });
    } catch (error) {
      console.error("Error toggling notifications:", error);
      toast({
        title: "エラーが発生しました",
        description: "設定を更新できませんでした。後でもう一度お試しください。",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      // Use the custom email if isCustomEmail is true, otherwise use null to reset to default
      const emailToSave = isCustomEmail ? email : undefined;
      await onUpdateSettings(enabled, emailToSave, time);
      setIsEditing(false);
      toast({
        title: "メールアドレスが更新されました",
        description: isCustomEmail ? "カスタムメールアドレスを使用します" : "アカウントのメールアドレスを使用します",
      });
    } catch (error) {
      console.error("Error updating email:", error);
      toast({
        title: "エラーが発生しました",
        description: "メールアドレスを更新できませんでした。後でもう一度お試しください。",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCustomEmail = () => {
    const newIsCustom = !isCustomEmail;
    setIsCustomEmail(newIsCustom);
    
    // Reset to default email if toggling off custom email
    if (!newIsCustom) {
      setEmail(defaultEmail);
    }
  };

  const handleTimeChange = async (selectedTime: string) => {
    setTime(selectedTime);
    try {
      await onUpdateSettings(enabled, isCustomEmail ? email : undefined, selectedTime);
      toast({
        title: "通知時間が更新されました",
        description: `通知時間が ${selectedTime} に設定されました`,
      });
    } catch (error) {
      console.error("Error updating notification time:", error);
      toast({
        title: "エラーが発生しました",
        description: "通知時間を更新できませんでした。後でもう一度お試しください。",
        variant: "destructive"
      });
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return options;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Bell className="w-5 h-5" />
        <h2 className="text-lg font-semibold">通知設定</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">日次ダイジェストメール</h3>
            <p className="text-sm text-muted-foreground">
              毎日の活動サマリーを受け取る
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={enabled}
              onCheckedChange={handleToggleNotifications}
              disabled={loading}
            />
            <Label htmlFor="daily-digest">{enabled ? "オン" : "オフ"}</Label>
          </div>
        </div>
        
        {enabled && (
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <h3 className="font-medium">通知時間</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                通知を受け取る時間を設定します（過去24時間の活動をまとめます）
              </p>
              <Select 
                value={time} 
                onValueChange={handleTimeChange}
                disabled={!enabled || loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="通知時間を選択" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeOptions().map(timeOption => (
                    <SelectItem key={timeOption} value={timeOption}>
                      {timeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                選択した時間に、直前の24時間の活動サマリーが届きます
              </p>
            </div>
          </div>
        )}
        
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <h3 className="font-medium">通知メールアドレス</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                通知用のカスタムメールアドレスを使用
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isCustomEmail}
                onCheckedChange={handleToggleCustomEmail}
                disabled={loading || isEditing}
              />
              <Label>{isCustomEmail ? "カスタム" : "デフォルト"}</Label>
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notification-email">メールアドレス</Label>
                <Input
                  id="notification-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="メールアドレスを入力"
                  type="email"
                  disabled={loading || !isCustomEmail}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="default"
                  size="sm" 
                  onClick={handleSaveEmail}
                  disabled={loading || !email}
                >
                  保存
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEmail(notificationEmail || defaultEmail);
                    setIsCustomEmail(!!notificationEmail && notificationEmail !== defaultEmail);
                  }}
                  disabled={loading}
                >
                  キャンセル
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-md flex justify-between items-center">
                <span className="text-sm font-medium break-all">
                  {isCustomEmail ? email : defaultEmail}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                >
                  編集
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {isCustomEmail ? "カスタムメールアドレスを使用中" : "アカウントのメールアドレスを使用中"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
