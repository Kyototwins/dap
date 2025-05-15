
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function NotificationSettings() {
  const [emailDigest, setEmailDigest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("ユーザーが認証されていません");
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("email_digest_enabled")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      
      setEmailDigest(profile?.email_digest_enabled || false);
      setHasChanged(false);
    } catch (error: any) {
      console.error("設定の読み込みエラー:", error);
      toast({
        title: "設定の読み込みに失敗しました",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEmailDigest = () => {
    setEmailDigest(!emailDigest);
    setHasChanged(true);
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("ユーザーが認証されていません");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          email_digest_enabled: emailDigest
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "設定を保存しました",
        description: "通知設定が更新されました",
      });
      setHasChanged(false);
    } catch (error: any) {
      console.error("設定の保存エラー:", error);
      toast({
        title: "設定の保存に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const setupCronJob = async () => {
    try {
      setIsSaving(true);
      
      // 日次ダイジェスト用のクーロンジョブをセットアップするエッジ関数を呼び出す
      const { error } = await supabase.functions.invoke('setup-daily-digest-cron');
      
      if (error) throw error;
      
      toast({
        title: "ダイジェストスケジュールを設定しました",
        description: "日次メールダイジェストのスケジュールが設定されました",
      });
      
    } catch (error: any) {
      console.error("Cronジョブ設定エラー:", error);
      toast({
        title: "スケジュール設定に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          通知設定
          {hasChanged && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              変更あり
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          DAPからどのように通知を受け取るか設定します
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-digest">デイリーダイジェストメール</Label>
              <p className="text-sm text-muted-foreground">
                毎日の活動サマリーをメールで受け取る
              </p>
            </div>
            <Switch 
              id="email-digest" 
              checked={emailDigest} 
              onCheckedChange={handleToggleEmailDigest}
              disabled={isLoading || isSaving}
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={loadUserSettings} 
            disabled={isLoading || isSaving}
          >
            キャンセル
          </Button>
          <div className="space-x-2">
            {process.env.NODE_ENV === 'development' && (
              <Button
                variant="outline"
                onClick={setupCronJob}
                disabled={isLoading || isSaving}
              >
                Cronジョブセットアップ
              </Button>
            )}
            <Button 
              onClick={saveSettings} 
              disabled={!hasChanged || isLoading || isSaving}
            >
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
