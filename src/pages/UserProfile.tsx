
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  gender: string | null;
  origin: string | null;
  about_me: string | null;
  avatar_url: string | null;
  ideal_date: string | null;
  life_goal: string | null;
  superpower: string | null;
  university: string | null;
  hobbies?: string[];
  languages?: string[];
  learning_languages?: string[];
}

export default function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProfile(data);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
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

  const genderText = {
    male: "男性",
    female: "女性",
    other: "その他",
    prefer_not_to_say: "回答しない",
  }[profile.gender || ""] || profile.gender;

  const originText = {
    japan: "日本",
    usa: "アメリカ",
    korea: "韓国",
    china: "中国",
    other: "その他",
  }[profile.origin || ""] || profile.origin;

  return (
    <div className="py-6 space-y-6">
      <div className="text-center">
        <Avatar className="w-32 h-32 mx-auto">
          <AvatarImage
            src={profile.avatar_url || "/placeholder.svg"}
            alt="Profile"
          />
          <AvatarFallback>
            {profile.first_name?.[0]}
            {profile.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <h1 className="mt-4 text-2xl font-bold">
          {profile.first_name} {profile.last_name}
        </h1>
        <div className="mt-2 flex justify-center gap-2 flex-wrap">
          {profile.age && <Badge variant="secondary">{profile.age}歳</Badge>}
          {profile.gender && <Badge variant="secondary">{genderText}</Badge>}
          {profile.origin && <Badge variant="secondary">{originText}</Badge>}
          {profile.university && (
            <Badge variant="secondary">{profile.university}</Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">基本情報</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.university && (
            <div>
              <h3 className="font-medium mb-2">大学</h3>
              <p className="text-muted-foreground">{profile.university}</p>
            </div>
          )}
          {profile.about_me && (
            <div>
              <h3 className="font-medium mb-2">自己紹介</h3>
              <p className="text-muted-foreground">{profile.about_me}</p>
            </div>
          )}
          {profile.hobbies && profile.hobbies.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">趣味・興味</h3>
              <div className="flex flex-wrap gap-2">
                {profile.hobbies.map((hobby) => (
                  <Badge key={hobby} variant="secondary">
                    {hobby}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {(profile.languages || profile.learning_languages) && (
            <div>
              <h3 className="font-medium mb-2">言語</h3>
              {profile.languages && profile.languages.length > 0 && (
                <div className="mb-2">
                  <span className="text-sm font-medium">使用言語：</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.languages.map((lang) => (
                      <Badge key={lang} variant="secondary">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {profile.learning_languages && profile.learning_languages.length > 0 && (
                <div>
                  <span className="text-sm font-medium">学習中：</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.learning_languages.map((lang) => (
                      <Badge key={lang} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {(profile.ideal_date || profile.life_goal || profile.superpower) && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">その他の情報</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.ideal_date && (
              <div>
                <h3 className="font-medium mb-2">理想のデート</h3>
                <p className="text-muted-foreground">{profile.ideal_date}</p>
              </div>
            )}
            {profile.life_goal && (
              <div>
                <h3 className="font-medium mb-2">人生の目標</h3>
                <p className="text-muted-foreground">{profile.life_goal}</p>
              </div>
            )}
            {profile.superpower && (
              <div>
                <h3 className="font-medium mb-2">欲しい超能力</h3>
                <p className="text-muted-foreground">{profile.superpower}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
