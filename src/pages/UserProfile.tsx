import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/messages";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";
import { UserProfileInfo } from "@/components/profile/UserProfileInfo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserProfile = useCallback(async (userId: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Process language_levels field
        let parsedLanguageLevels: Record<string, number> | null = null;
        
        if (data.language_levels) {
          if (typeof data.language_levels === 'string') {
            try {
              parsedLanguageLevels = JSON.parse(data.language_levels);
            } catch (e) {
              console.error("Error parsing language levels:", e);
              // Keep as is if parsing fails
            }
          } else if (typeof data.language_levels === 'object') {
            parsedLanguageLevels = data.language_levels as Record<string, number>;
          }
        }
        
        // Create profile object with the correct types
        const profileData: Profile = {
          ...data,
          language_levels: parsedLanguageLevels,
          fcm_token: data.fcm_token ?? null
        };
        
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("プロフィールの読み込み中にエラーが発生しました。");
      toast({
        title: "エラーが発生しました",
        description: "プロフィールの読み込みに失敗しました。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (id) {
      fetchUserProfile(id);
    } else {
      setError("ユーザーIDが指定されていません。");
      setLoading(false);
    }
  }, [id, fetchUserProfile]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <ProfileLoading />;
  }

  if (error || !profile) {
    return <ProfileNotFound />;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-gray-600"
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
      </div>

      <UserProfileInfo profile={profile} />
    </div>
  );
}
