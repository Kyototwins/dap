
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface NotificationSettingsProps {
  emailDigestEnabled?: boolean;
  notificationEmail?: string;
  defaultEmail?: string;
  onUpdateSettings?: (emailDigestEnabled: boolean, notificationEmail?: string) => Promise<void>;
}

export function NotificationSettings({
  emailDigestEnabled: initialEmailDigestEnabled = false,
  notificationEmail: initialNotificationEmail = "",
  defaultEmail = "",
  onUpdateSettings
}: NotificationSettingsProps = {}) {
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(initialEmailDigestEnabled);
  const [notificationEmail, setNotificationEmail] = useState(initialNotificationEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!onUpdateSettings) {
      loadUserSettings();
    }
  }, [onUpdateSettings]);

  const loadUserSettings = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Get user profile and notification settings
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("email_digest_enabled, notification_email")
        .eq("id", user.id)
        .single();
      
      if (error) {
        // If the error is because the columns don't exist, we'll just use default values
        console.error("Error loading notification settings:", error.message);
        return;
      }
      
      if (profile) {
        setEmailDigestEnabled(profile.email_digest_enabled || false);
        setNotificationEmail(profile.notification_email || "");
      }
    } catch (error: any) {
      console.error("Error loading notification settings:", error.message);
      toast({
        variant: "destructive",
        title: "Failed to load settings",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (onUpdateSettings) {
      await onUpdateSettings(emailDigestEnabled, notificationEmail);
      return;
    }

    try {
      setIsSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { error } = await supabase
        .from("profiles")
        .update({
          email_digest_enabled: emailDigestEnabled,
          notification_email: notificationEmail.trim() || null
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      // If digest is enabled, call the function to set up the cron job
      if (emailDigestEnabled) {
        const { error: fnError } = await supabase.functions.invoke("setup-email-digest-job");
        if (fnError) throw fnError;
      }
      
      toast({
        title: "Settings saved",
        description: "Your notification settings have been updated.",
      });
    } catch (error: any) {
      console.error("Error saving notification settings:", error.message);
      toast({
        variant: "destructive",
        title: "Failed to save settings",
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Daily Email Digest</h3>
              <p className="text-sm text-gray-500">
                Receive a daily summary of your notifications at 9:30 AM
              </p>
            </div>
            <Switch
              checked={emailDigestEnabled}
              onCheckedChange={setEmailDigestEnabled}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Notification Email</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter a custom email for notifications or leave blank to use your account email ({defaultEmail})
            </p>
            <div className="flex gap-2 items-start">
              <Input
                placeholder="Enter email address (optional)"
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={saveSettings} 
          disabled={isSaving}
          className="bg-[#7f1184] hover:bg-[#671073]"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
