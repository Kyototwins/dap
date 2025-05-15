
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Bell, Mail } from "lucide-react";

export function NotificationSettings() {
  const [loading, setLoading] = useState(false);
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(false);

  // Load user's current notification settings
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("email_digest_enabled")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }
        
        if (data) {
          setEmailDigestEnabled(data.email_digest_enabled || false);
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save notification settings
  const saveSettings = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          email_digest_enabled: emailDigestEnabled
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your notification settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your notification settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Test sending a digest email (development only)
  const testDigestEmail = async () => {
    setLoading(true);
    try {
      // Get current user to include in the test request
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Send test request with the user's ID
      const response = await fetch('https://yxacicvkyusnykivbmtg.supabase.co/functions/v1/send-daily-digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4YWNpY3ZreXVzbnlraXZibXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NDY3MTYsImV4cCI6MjA1NTQyMjcxNn0.FXjSvFChIG5t23cDV5VKHEkl82Ki-pnv64PWQjcd6jQ'
        },
        body: JSON.stringify({ 
          test: true,
          user_id: user.id 
        })
      });
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Test digest email sent",
        description: "Check your email inbox for the test digest.",
      });
    } catch (error) {
      console.error("Error sending test digest email:", error);
      toast({
        title: "Error sending test email",
        description: "There was a problem sending the test digest email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            メール通知
          </CardTitle>
          <CardDescription>
            メールで受け取る通知を管理します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="email-digest" className="flex flex-col gap-1">
              <span>日次メールダイジェスト</span>
              <span className="font-normal text-sm text-muted-foreground">
                毎日のアクティビティの要約をメールで受け取る
              </span>
            </Label>
            <Switch
              id="email-digest"
              checked={emailDigestEnabled}
              onCheckedChange={setEmailDigestEnabled}
              disabled={loading}
            />
          </div>
          <Separator />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={testDigestEmail}
            disabled={loading}
          >
            テスト通知送信
          </Button>
          <Button onClick={saveSettings} disabled={loading}>
            {loading ? "保存中..." : "変更を保存"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            アプリ内通知
          </CardTitle>
          <CardDescription>
            アプリ内の通知設定を管理します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
            現在、すべてのアプリ内通知はデフォルトで有効になっています。これらの設定は後日カスタマイズできるようになります。
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
