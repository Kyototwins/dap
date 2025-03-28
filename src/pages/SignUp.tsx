
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase, testSupabaseConnection, isOffline } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, WifiOff } from "lucide-react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [offline, setOffline] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // オンライン状態の監視
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    setOffline(isOffline());

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  // ページ読み込み時に接続テスト
  useEffect(() => {
    const checkConnection = async () => {
      if (!offline) {
        try {
          const { success } = await testSupabaseConnection();
          setConnectionError(!success);
        } catch (error) {
          setConnectionError(true);
        }
      }
    };
    checkConnection();
  }, [offline]);

  const testConnection = async () => {
    if (offline) {
      return false;
    }
    
    try {
      const { success, error } = await testSupabaseConnection();
      if (!success) {
        console.error("Supabase connection error:", error);
        setConnectionError(true);
        return false;
      }
      setConnectionError(false);
      return true;
    } catch (error) {
      console.error("Connection test failed:", error);
      setConnectionError(true);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // オフライン状態のチェック
      if (offline) {
        throw new Error("インターネット接続がありません。ネットワーク接続を確認してください。");
      }

      // 接続テスト
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error("サーバーに接続できません。ネットワーク接続を確認してください。");
      }

      // サインアップ処理
      const signUpPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      // タイムアウト処理
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("登録処理がタイムアウトしました。後でもう一度お試しください。")), 15000);
      });
      
      // どちらか早い方を採用
      const { data, error } = await Promise.race([signUpPromise, timeoutPromise]) as any;

      if (error) {
        throw error;
      }

      // メール送信成功のメッセージを表示
      toast({
        title: "確認メールを送信しました",
        description: "メールに記載されているリンクをクリックして、登録を完了してください。",
      });

      // ログインページにリダイレクト
      navigate("/login");

    } catch (error: any) {
      let errorMessage = "アカウントの作成に失敗しました。";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("Network Error")) {
        errorMessage = "サーバーへの接続に失敗しました。インターネット接続を確認してください。";
      } else if (errorMessage.includes("User already registered")) {
        errorMessage = "このメールアドレスは既に登録されています。ログインしてください。";
      }
      
      toast({
        title: "エラーが発生しました",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
