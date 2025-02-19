
import { useEffect, useState } from "react";
import { Loader2, Camera, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        // ユーザーが認証されていない場合はログインページにリダイレクト
        window.location.href = "/login";
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
            onClick={() => {/* TODO: 画像アップロード機能を実装 */}}
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        <h1 className="mt-4 text-2xl font-bold">
          {profile.first_name} {profile.last_name}
        </h1>
        <div className="mt-2 flex justify-center gap-2">
          {profile.age && <Badge variant="secondary">{profile.age}歳</Badge>}
          {profile.gender && <Badge variant="secondary">{genderText}</Badge>}
          {profile.origin && <Badge variant="secondary">{originText}</Badge>}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold">自己紹介</h2>
          <Button variant="ghost" size="icon">
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {profile.about_me || "自己紹介文が未設定です"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">その他の情報</h2>
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
          onClick={() => {/* TODO: プロフィール編集ページに遷移 */}}
        >
          プロフィールを編集
        </Button>
      </div>
    </div>
  );
}
