
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useConnectionStatus } from "./useConnectionStatus";
import { AuthFormData } from "@/types/auth";

export function useAuthOperations() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { connectionError, offline, testConnection } = useConnectionStatus();

  const handleSignUp = async (formData: AuthFormData) => {
    const { email, password, name } = formData;
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
          emailRedirectTo: window.location.origin + '/login',
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

      console.log("Sign-up response:", data);

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
      
      console.error("Sign-up error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (formData: AuthFormData) => {
    const { email, password } = formData;
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

      if (!authData?.user) {
        throw new Error("ユーザーデータを取得できませんでした。");
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
      const hasProfile = profileData && profileData.first_name && profileData.last_name;
      if (!hasProfile) {
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

  return {
    loading,
    connectionError,
    offline,
    handleSignUp,
    handleLogin
  };
}
