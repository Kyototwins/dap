
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Mail, SendIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface NotificationSettingsProps {
  emailDigestEnabled: boolean;
  notificationEmail: string;
  defaultEmail: string; // The email from auth - used as fallback
  onUpdateSettings: (emailDigestEnabled: boolean, notificationEmail?: string) => Promise<void>;
}

export function NotificationSettings({ 
  emailDigestEnabled, 
  notificationEmail,
  defaultEmail,
  onUpdateSettings 
}: NotificationSettingsProps) {
  const [enabled, setEnabled] = useState(emailDigestEnabled);
  const [email, setEmail] = useState(notificationEmail || defaultEmail);
  const [isCustomEmail, setIsCustomEmail] = useState(!!notificationEmail && notificationEmail !== defaultEmail);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [testEmailSending, setTestEmailSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Update email when props change
    setEmail(notificationEmail || defaultEmail);
    setIsCustomEmail(!!notificationEmail && notificationEmail !== defaultEmail);
  }, [notificationEmail, defaultEmail]);

  const handleToggleNotifications = async () => {
    setLoading(true);
    try {
      const newState = !enabled;
      await onUpdateSettings(newState, isCustomEmail ? email : undefined);
      setEnabled(newState);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      // Use the custom email if isCustomEmail is true, otherwise use null to reset to default
      const emailToSave = isCustomEmail ? email : null;
      await onUpdateSettings(enabled, emailToSave);
      setIsEditing(false);
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

  const sendTestEmail = async () => {
    try {
      setTestEmailSending(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not logged in");
      }
      
      // Determine which email to use for the test
      const emailToUse = isCustomEmail ? email : defaultEmail;
      
      // Call test email function
      const response = await supabase.functions.invoke("test-notification-email", {
        body: { userId: user.id, email: emailToUse },
      });
      
      if (!response.data?.success) {
        throw new Error(response.data?.error || "Failed to send test email");
      }
      
      toast({
        title: "Test email sent",
        description: `A test notification has been sent to ${emailToUse}. Please check your inbox.`,
      });
    } catch (error: any) {
      console.error("Failed to send test email:", error);
      toast({
        title: "Error sending test email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setTestEmailSending(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Bell className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Notification Settings</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">Daily Digest Email</h3>
            <p className="text-sm text-muted-foreground">
              Receive a daily summary of your activity at 7:00 AM
            </p>
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
        
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <h3 className="font-medium">Notification Email</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Use custom email for notifications
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isCustomEmail}
                onCheckedChange={handleToggleCustomEmail}
                disabled={loading || isEditing}
              />
              <Label>{isCustomEmail ? "Custom" : "Default"}</Label>
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notification-email">Email Address</Label>
                <Input
                  id="notification-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
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
                  Save
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
                  Cancel
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
                  Edit
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {isCustomEmail ? "Using custom email address" : "Using account email address"}
              </p>
            </div>
          )}
        </div>

        {/* Test email section */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">Verify Notification Email</h3>
              <p className="text-sm text-muted-foreground">
                Send a test email to verify your notification settings
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={sendTestEmail}
              disabled={testEmailSending || !enabled}
              className="flex items-center gap-1"
            >
              <SendIcon className="w-4 h-4" />
              {testEmailSending ? "Sending..." : "Send Test"}
            </Button>
          </div>
          {!enabled && (
            <p className="text-xs text-amber-500 mt-2">
              Enable daily digest notifications first to send a test email
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
