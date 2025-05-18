
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";

type Props = {
  session: any;
}

export default function Account({ session }: Props) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        const { user } = session;

        const { data, error } = await supabase
          .from('profiles')
          .select(`username, email, avatar_url, first_name, last_name`)
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setUsername(data.first_name ? `${data.first_name} ${data.last_name || ''}` : data.username);
          setEmail(user.email);
          setAvatarUrl(data.avatar_url);
        }
      } catch (error: any) {
        console.error('Error loading user data:', error.message);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [session]);

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  }

  return (
    <AppLayout>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Account</CardTitle>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-doshisha-purple"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatar_url || undefined} />
                    <AvatarFallback>{username?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{username || "User"}</h3>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button 
                    onClick={() => window.location.href = "/profile"} 
                    variant="outline" 
                    className="w-full"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
