
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function ProfileSetup() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    origin: "",
    sexuality: "",
    aboutMe: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 現在のユーザーを取得
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("ユーザーが見つかりません");

      // プロフィールを更新
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          age: parseInt(formData.age),
          gender: formData.gender,
          origin: formData.origin,
          sexuality: formData.sexuality,
          about_me: formData.aboutMe,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "プロフィールを保存しました",
        description: "マッチング画面に移動します",
      });

      navigate("/matches");

    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message || "プロフィールの保存に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AuthLayout
      title="プロフィール設定"
      subtitle="あなたのことを教えてください"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">姓</Label>
            <Input
              id="firstName"
              placeholder="山田"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">名</Label>
            <Input
              id="lastName"
              placeholder="太郎"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">年齢</Label>
          <Input
            id="age"
            type="number"
            min="18"
            max="100"
            value={formData.age}
            onChange={(e) => handleChange("age", e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label>性別</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleChange("gender", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="性別を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">男性</SelectItem>
              <SelectItem value="female">女性</SelectItem>
              <SelectItem value="other">その他</SelectItem>
              <SelectItem value="prefer_not_to_say">回答しない</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>出身地</Label>
          <Select
            value={formData.origin}
            onValueChange={(value) => handleChange("origin", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="出身地を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="japan">日本</SelectItem>
              <SelectItem value="china">中国</SelectItem>
              <SelectItem value="korea">韓国</SelectItem>
              <SelectItem value="usa">アメリカ</SelectItem>
              <SelectItem value="other">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>性的指向</Label>
          <Select
            value={formData.sexuality}
            onValueChange={(value) => handleChange("sexuality", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="性的指向を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="heterosexual">異性愛</SelectItem>
              <SelectItem value="homosexual">同性愛</SelectItem>
              <SelectItem value="bisexual">両性愛</SelectItem>
              <SelectItem value="other">その他</SelectItem>
              <SelectItem value="prefer_not_to_say">回答しない</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aboutMe">自己紹介</Label>
          <Textarea
            id="aboutMe"
            placeholder="あなたの興味や趣味について教えてください"
            value={formData.aboutMe}
            onChange={(e) => handleChange("aboutMe", e.target.value)}
            className="min-h-[100px]"
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "保存中..." : "プロフィールを保存"}
        </Button>
      </form>
    </AuthLayout>
  );
}
