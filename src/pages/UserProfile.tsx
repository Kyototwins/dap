
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageSquare, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile as ProfileType } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export default function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const authOperations = useAuth();

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      // Check if this is the current user's profile
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (user && id === user.id) {
        setIsCurrentUser(true);
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProfile(data as ProfileType);
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

  const handleMessage = () => {
    // Navigate to messages with this user
    navigate("/messages");
  };

  const handleEditProfile = () => {
    navigate("/profile/setup");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-doshisha-purple"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">プロフィールが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Header image */}
      <div className="relative h-48 -mx-4 bg-gray-100 overflow-hidden">
        {profile.image_url_1 ? (
          <img 
            src={profile.image_url_1} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-50 to-gray-50" />
        )}
      </div>
      
      {/* Profile avatar */}
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
      
      {/* Profile info */}
      <div className="px-4">
        <h1 className="text-3xl font-bold mb-1">
          {profile.first_name} {profile.last_name}
        </h1>
        <p className="text-gray-600 mb-4">
          {profile.university ? `${profile.university}${profile.department ? `, ${profile.department}` : ''}` : ''}
        </p>
        
        {/* Action buttons */}
        <div className="flex gap-3 mb-6">
          <Button 
            onClick={handleMessage}
            variant="outline"
            className="flex-1 gap-2 border-gray-200"
          >
            <MessageSquare className="w-4 h-4" />
            <span>メッセージ</span>
          </Button>
          
          {isCurrentUser ? (
            <Button 
              onClick={handleEditProfile}
              className="flex-1 gap-2 bg-doshisha-purple hover:bg-doshisha-darkPurple"
            >
              <Edit className="w-4 h-4" />
              <span>編集</span>
            </Button>
          ) : (
            <Button 
              className="flex-1 gap-2 bg-doshisha-purple hover:bg-doshisha-darkPurple"
            >
              評価
            </Button>
          )}
        </div>
        
        {/* Profile completion progress - only show for current user */}
        {isCurrentUser && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">プロフィール完成度: 90%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-doshisha-purple" 
                style={{ width: `90%` }}
              />
            </div>
          </div>
        )}
        
        {/* Tabs */}
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
          
          <TabsContent value="about" className="mt-0 space-y-6">
            {/* About Me */}
            <div className="dap-card p-6">
              <h2 className="text-xl font-bold mb-4">About Me</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {profile.about_me || "自己紹介文が設定されていません。"}
              </p>
            </div>
            
            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <div className="dap-card p-6">
                <h2 className="text-xl font-bold mb-4">Languages</h2>
                <div className="space-y-4">
                  {profile.languages.map((language, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{language}</div>
                        <div className="text-sm text-gray-500">
                          {index === 0 ? "Native" : index === 1 ? "Fluent" : "Learning"}
                        </div>
                      </div>
                      <div className={`px-4 py-1 rounded-full text-sm ${
                        index === 0 ? "bg-blue-100 text-blue-800" : 
                        index === 1 ? "bg-green-100 text-green-800" : 
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {index === 0 ? "Native" : index === 1 ? "Fluent" : "Learning"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Interests/Hobbies */}
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
            
            {/* Academic Info */}
            {profile.university && (
              <div className="dap-card p-6">
                <h2 className="text-xl font-bold mb-4">Academic Info</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-500">University</div>
                    <div className="font-medium">{profile.university}</div>
                  </div>
                  {profile.department && (
                    <div>
                      <div className="text-gray-500">Faculty</div>
                      <div className="font-medium">{profile.department}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-gray-500">Year</div>
                    <div className="font-medium">{profile.year}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Stats */}
            <div className="dap-card p-6">
              <h2 className="text-xl font-bold mb-4">Stats</h2>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-doshisha-purple">27</div>
                  <div className="text-gray-500">Connections</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-doshisha-purple">12</div>
                  <div className="text-gray-500">Events</div>
                </div>
              </div>
            </div>
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
