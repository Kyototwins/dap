
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, WifiOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, connectionError, offline, handleLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin({ email, password });
  };

  return (
    <AuthLayout
      title="おかえりなさい"
      subtitle="国際交流を始めましょう"
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
        <Button type="submit" className="w-full" disabled={loading || offline || connectionError}>
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
