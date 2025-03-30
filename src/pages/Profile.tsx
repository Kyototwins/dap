
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Camera, Edit2, Languages, Book, School, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

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
  department: string | null;
  year: string | null;
  hobbies: string[] | null;
  languages: string[] | null;
  language_levels: string | null;
  learning_languages: string[] | null;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handleEditProfile = () => {
    navigate("/profile/setup");
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
        <div className="relative inline-block">
          <Avatar className="w-32 h-32">
            <AvatarImage
              src={profile.avatar_url || "/placeholder.svg"}
              alt="Profile"
            />
            <AvatarFallback>
              {profile.first_name?.[0]}
              {profile.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full"
            onClick={handleEditProfile}
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        <h1 className="mt-4 text-2xl font-bold">
          {profile.first_name} {profile.last_name}
        </h1>
        <div className="mt-2 flex justify-center gap-2 flex-wrap">
          {profile.age && <Badge variant="secondary">{profile.age}歳</Badge>}
          {profile.gender && <Badge variant="secondary">{genderText}</Badge>}
          {profile.origin && <Badge variant="secondary">{originText}</Badge>}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold">学歴情報</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleEditProfile}>
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">大学</h3>
              <p className="text-muted-foreground">{profile.university || "未設定"}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">学部</h3>
              <p className="text-muted-foreground">{profile.department || "未設定"}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">学年</h3>
              <p className="text-muted-foreground">{profile.year || "未設定"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold">自己紹介</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleEditProfile}>
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground whitespace-pre-line">
            {profile.about_me || "自己紹介文が未設定です"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold">言語スキル</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleEditProfile}>
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.languages && profile.languages.length > 0 ? (
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
          ) : (
            <p className="text-muted-foreground">言語スキルが未設定です</p>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold">趣味・興味</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleEditProfile}>
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {profile.hobbies && profile.hobbies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.hobbies.map((hobby) => (
                <Badge key={hobby} variant="secondary">
                  {hobby}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">趣味・興味が未設定です</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold">その他の情報</h2>
          <Button variant="ghost" size="icon" onClick={handleEditProfile}>
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">理想のデート</h3>
            <p className="text-muted-foreground">{profile.ideal_date || "未設定"}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">人生の目標</h3>
            <p className="text-muted-foreground">{profile.life_goal || "未設定"}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">欲しい超能力</h3>
            <p className="text-muted-foreground">{profile.superpower || "未設定"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-24 right-4">
        <Button 
          size="lg"
          onClick={handleEditProfile}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg"
        >
          プロフィールを編集
        </Button>
      </div>
    </div>
  );
}
