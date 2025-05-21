
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
        title: newState ? "Notifications Enabled" : "Notifications Disabled",
        description: newState ? "You will receive daily digest emails" : "Notifications have been turned off",
      });
    } catch (error) {
      console.error("Error toggling notifications:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again later.",
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
        title: "Email Address Updated",
        description: isCustomEmail ? "Using custom email address" : "Using account email address",
      });
    } catch (error) {
      console.error("Error updating email:", error);
      toast({
        title: "Error",
        description: "Failed to update email address. Please try again later.",
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
        title: "Notification Time Updated",
        description: `Notification time set to ${selectedTime}`,
      });
    } catch (error) {
      console.error("Error updating notification time:", error);
      toast({
        title: "Error",
        description: "Failed to update notification time. Please try again later.",
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
        <h2 className="text-lg font-semibold">Notification Settings</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">Daily Digest Email</h3>
            <p className="text-sm text-muted-foreground">
              Receive a summary of daily activities
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
        
        {enabled && (
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <h3 className="font-medium">Notification Time</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Set the time when you want to receive notifications (summarizing the past 24 hours)
              </p>
              <Select 
                value={time} 
                onValueChange={handleTimeChange}
                disabled={!enabled || loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select notification time" />
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
                At the selected time, you'll receive a summary of activities from the previous 24 hours
              </p>
            </div>
          </div>
        )}
        
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <h3 className="font-medium">Notification Email Address</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Use custom email address for notifications
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
                  placeholder="Enter your email address"
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
      </CardContent>
    </Card>
  );
}
