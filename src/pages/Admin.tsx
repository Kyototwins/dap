
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Mail, Users } from "lucide-react";
import { useState } from "react";

export default function Admin() {
  const { isAdmin, loading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/matches");
    }
  }, [isAdmin, loading, navigate]);

  const handleSendDigest = async () => {
    try {
      setSending(true);
      
      const { data, error } = await supabase.functions.invoke("send-daily-digest");
      
      if (error) {
        throw error;
      }
      
      if (data?.success) {
        toast({
          title: "Digest emails sent successfully",
          description: `Processed ${data.processed} users. Check the logs for details.`,
        });
      } else {
        throw new Error(data?.error || "Failed to send digest emails");
      }
    } catch (error: any) {
      console.error("Error sending digest:", error);
      toast({
        title: "Error sending digest emails",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-doshisha-purple" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Send daily digest emails to all users who have email notifications enabled.
              This will send yesterday's activity summary to eligible users.
            </p>
            <Button 
              onClick={handleSendDigest}
              disabled={sending}
              className="w-full sm:w-auto"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending Digest...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Daily Digest
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              User management features will be available in future updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
