
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

export default function Login() {
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

      // ログイン処理
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // タイムアウト処理
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("ログイン処理がタイムアウトしました。後でもう一度お試しください。")), 15000);
      });
      
      // どちらか早い方を採用
      const { data: authData, error: authError } = await Promise.race([loginPromise, timeoutPromise]) as any;

      if (authError) {
        throw authError;
      }

      // プロフィール情報を取得
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', authData.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116はレコードが見つからないエラー
        throw profileError;
      }

      // ログイン成功のトースト表示
      toast({
        title: "ログインしました",
        description: "アプリへようこそ！",
      });

      // プロフィールの設定状況に応じてリダイレクト
      if (!profileData || !profileData.first_name || !profileData.last_name) {
        // プロフィール未設定の場合はプロフィール設定画面へ
        navigate("/profile/setup");
      } else {
        // プロフィール設定済みの場合はマッチング画面へ
        navigate("/matches");
      }

    } catch (error: any) {
      let errorMessage = "ログインに失敗しました。";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("Network Error")) {
        errorMessage = "サーバーへの接続に失敗しました。インターネット接続を確認してください。";
      } else if (errorMessage.includes("Invalid login credentials")) {
        errorMessage = "メールアドレスまたはパスワードが正しくありません。";
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
