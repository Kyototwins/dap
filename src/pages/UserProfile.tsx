
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/messages";
import { UserProfileHeader } from "@/components/profile/UserProfileHeader";
import { UserProfileAboutTab } from "@/components/profile/UserProfileAboutTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaneIcon } from "lucide-react";

export default function UserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id]);

  const fetchProfile = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      if (error) throw error;

      // Create a complete profile object with required fields
      const completeProfile: Profile = {
        id: data.id,
        created_at: data.created_at,
        first_name: data.first_name,
        last_name: data.last_name,
        age: data.age,
        gender: data.gender,
        origin: data.origin,
        about_me: data.about_me,
        avatar_url: data.avatar_url,
        sexuality: data.sexuality,
        university: data.university,
        department: data.department,
        year: data.year,
        image_url_1: data.image_url_1,
        image_url_2: data.image_url_2,
        ideal_date: data.ideal_date,
        life_goal: data.life_goal,
        superpower: data.superpower,
        worst_nightmare: data.worst_nightmare,
        friend_activity: data.friend_activity,
        best_quality: data.best_quality,
        photo_comment: data.photo_comment,
        hobby_photo_url: data.hobby_photo_url,
        hobby_photo_comment: data.hobby_photo_comment,
        hobbies: data.hobbies,
        languages: data.languages,
        learning_languages: data.learning_languages,
        language_levels: data.language_levels,
        pet_photo_url: data.pet_photo_url,
        pet_photo_comment: data.pet_photo_comment,
        fcm_token: data.fcm_token || null // Add FCM token with fallback
      };
      
      setProfile(completeProfile);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
      navigate("/matches");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-doshisha-purple mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="text-center">
          <PlaneIcon className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="mt-2 text-xl font-semibold">Profile Not Found</h2>
          <p className="mt-1 text-gray-600">This user profile doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <UserProfileHeader profile={profile} />
      
      <Tabs defaultValue="about" className="w-full flex-1">
        <TabsList className="grid w-full grid-cols-1 bg-gray-100 p-1 sticky top-0 z-10">
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="pt-2 flex-1">
          <UserProfileAboutTab profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
