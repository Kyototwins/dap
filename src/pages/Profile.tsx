import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile as ProfileType } from "@/types/messages";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data as ProfileType);
      
      // Calculate profile completion
      if (data) {
        calculateCompletion(data);
      }
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = (profile: any) => {
    const fields = [
      'first_name', 'last_name', 'age', 'gender', 'origin', 'university',
      'department', 'about_me', 'avatar_url', 'languages'
    ];
    
    const completedFields = fields.filter(field => {
      if (Array.isArray(profile[field])) {
        return profile[field].length > 0;
      }
      return profile[field] !== null && profile[field] !== '';
    });
    
    setCompletion(Math.round((completedFields.length / fields.length) * 100));
  };

  const handleEditProfile = () => {
    navigate("/profile/setup");
  };

  if (loading) {
    return <ProfileLoading />;
  }

  if (!profile) {
    return <ProfileNotFound />;
  }

  const universitySuffix = profile.university ? 
    profile.department ? `、${profile.department}` : "" : "";
  
  const universityText = profile.university ? 
    `${profile.university}${universitySuffix}` : "大学情報未設定";

  return (
    <div className="pb-6">
      {/* ヘッダー画像 */}
      <div className="relative h-48 -mx-4 bg-gray-200 overflow-hidden">
        {profile.image_url_1 ? (
          <img 
            src={profile.image_url_1} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-100 to-blue-50" />
        )}
      </div>
      
      {/* プロフィールアバター */}
      <div className="relative -mt-16 px-4 mb-4">
        <Avatar className="w-32 h-32 border-4 border-white shadow-md">
          <AvatarImage
            src={profile.avatar_url || "/placeholder.svg"}
            alt="Profile"
          />
          <AvatarFallback className="text-2xl">
            {profile.first_name?.[0]}
            {profile.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
      </div>
      
      {/* プロフィール情報 */}
      <div className="px-4">
        <h1 className="text-3xl font-bold mb-1">
          {profile.first_name} {profile.last_name}
        </h1>
        <p className="text-gray-600 mb-4">{universityText}</p>
        
        {/* アクションボタン - メッセージボタンを削除してプロフィール編集ボタンのみにする */}
        <div className="flex mb-6">
          <Button 
            onClick={handleEditProfile}
            className="flex-1 gap-2 bg-doshisha-purple hover:bg-doshisha-darkPurple"
          >
            <Edit className="w-4 h-4" />
            <span>プロフィールを編集</span>
          </Button>
        </div>
        
        {/* プロフィールの完成度 */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">プロフィール完成度: {completion}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-doshisha-purple" 
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
        
        {/* タブ */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full bg-transparent border-b border-gray-200 rounded-none p-0 mb-6">
            <TabsTrigger 
              value="about" 
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-doshisha-purple data-[state=active]:text-doshisha-purple rounded-none"
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="connections" 
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-doshisha-purple data-[state=active]:text-doshisha-purple rounded-none"
            >
              Connections
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-doshisha-purple data-[state=active]:text-doshisha-purple rounded-none"
            >
              Events
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-0">
            <div className="dap-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">About Me</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {profile.about_me || "自己紹介文が設定されていません。"}
              </p>
            </div>
            
            {profile.languages && profile.languages.length > 0 && (
              <div className="dap-card p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((language, index) => (
                    <span key={index} className="dap-tag-blue">{language}</span>
                  ))}
                </div>
              </div>
            )}
            
            {profile.hobbies && profile.hobbies.length > 0 && (
              <div className="dap-card p-6">
                <h2 className="text-xl font-bold mb-4">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.hobbies.map((hobby, index) => (
                    <span key={index} className="dap-tag">{hobby}</span>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="connections">
            <div className="text-center py-8 text-gray-500">
              No connections yet
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <div className="text-center py-8 text-gray-500">
              No events yet
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
