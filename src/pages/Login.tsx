
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      // プロフィール情報を取得
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      // ログイン成功のトースト表示
      toast({
        title: "ログインしました",
        description: "アプリへようこそ！",
      });

      // プロフィールの設定状況に応じてリダイレクト
      if (!profileData.first_name || !profileData.last_name) {
        // プロフィール未設定の場合はプロフィール設定画面へ
        navigate("/profile/setup");
      } else {
        // プロフィール設定済みの場合はマッチング画面へ
        navigate("/matches");
      }

    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message || "ログインに失敗しました。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="おかえりなさい"
      subtitle="国際交流を始めましょう"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">大学メールアドレス</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.name@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "処理中..." : "ログイン"}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <span className="text-muted-foreground">アカウントをお持ちでない方は </span>
        <Link
          to="/signup"
          className="text-primary hover:underline hover-lift inline-block"
        >
          新規登録
        </Link>
      </div>
    </AuthLayout>
  );
}
