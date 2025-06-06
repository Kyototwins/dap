
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseNotificationSettingsProps {
  emailDigestEnabled: boolean;
  notificationEmail: string;
  defaultEmail: string;
  onUpdateSettings: (emailDigestEnabled: boolean, notificationEmail?: string) => Promise<void>;
}

export function useNotificationSettings({
  emailDigestEnabled,
  notificationEmail,
  defaultEmail,
  onUpdateSettings
}: UseNotificationSettingsProps) {
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

  return {
    enabled,
    email,
    isCustomEmail,
    loading,
    isEditing,
    testEmailSending,
    setEmail,
    setIsEditing,
    handleToggleNotifications,
    handleSaveEmail,
    handleToggleCustomEmail,
    sendTestEmail,
  };
}
