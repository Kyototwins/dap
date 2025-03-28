
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, WifiOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, connectionError, offline, handleSignUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignUp({ email, password, name });
  };

  return (
    <AuthLayout
      title="アカウント作成"
      subtitle="大学生の国際交流コミュニティに参加しよう"
    >
      {offline && (
        <Alert variant="destructive" className="mb-6">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            インターネット接続がありません。ネットワーク接続を確認してください。
          </AlertDescription>
        </Alert>
      )}
      
      {!offline && connectionError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            サーバーに接続できません。ネットワーク接続を確認してください。
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">氏名</Label>
          <Input
            id="name"
            placeholder="山田 太郎"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
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
            minLength={8}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading || offline || connectionError}>
          {loading ? "処理中..." : "アカウントを作成"}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <span className="text-muted-foreground">すでにアカウントをお持ちですか？ </span>
        <Link
          to="/login"
          className="text-primary hover:underline hover-lift inline-block"
        >
          ログイン
        </Link>
      </div>
    </AuthLayout>
  );
}
