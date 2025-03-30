
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Languages, Book, School, GraduationCap } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Profile as ProfileType } from "@/types/messages";

export default function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<ProfileType | null>(null);
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
  
  const languageLevels = profile.language_levels 
    ? JSON.parse(profile.language_levels as string) 
    : {};

  const languageLevelText = (level: number) => {
    const levels = [
      { value: 1, label: "初級" },
      { value: 2, label: "中級" },
      { value: 3, label: "上級" },
      { value: 4, label: "ネイティブ" },
    ];
    return levels.find(l => l.value === level)?.label || "初級";
  };

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
        </div>
      </div>

      {(profile.university || profile.department || profile.year) && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <School className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold">学歴情報</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.university && (
                <div>
                  <h3 className="font-medium mb-2">大学</h3>
                  <p className="text-muted-foreground">{profile.university}</p>
                </div>
              )}
              {profile.department && (
                <div>
                  <h3 className="font-medium mb-2">学部</h3>
                  <p className="text-muted-foreground">{profile.department}</p>
                </div>
              )}
              {profile.year && (
                <div>
                  <h3 className="font-medium mb-2">学年</h3>
                  <p className="text-muted-foreground">{profile.year}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {profile.about_me && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Book className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold">自己紹介</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">{profile.about_me}</p>
          </CardContent>
        </Card>
      )}

      {((profile.languages && profile.languages.length > 0) || 
        (profile.learning_languages && profile.learning_languages.length > 0)) && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Languages className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold">言語スキル</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.languages && profile.languages.length > 0 && (
              <div className="space-y-4">
                {profile.languages.map((lang) => (
                  <div key={lang} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{lang}</h3>
                      <Badge variant="outline">{languageLevelText(languageLevels[lang] || 1)}</Badge>
                    </div>
                    <Progress value={(languageLevels[lang] || 1) * 25} className="h-2" />
                  </div>
                ))}
              </div>
            )}

            {profile.learning_languages && profile.learning_languages.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">学習中の言語</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.learning_languages.map((lang) => (
                    <Badge key={lang} variant="outline">{lang}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {profile.hobbies && profile.hobbies.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold">趣味・興味</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.hobbies.map((hobby) => (
                <Badge key={hobby} variant="secondary">
                  {hobby}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
