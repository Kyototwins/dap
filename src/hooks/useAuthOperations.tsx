
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
      const { error: authError } = await Promise.race([loginPromise, timeoutPromise]) as any;

      if (authError) {
        throw authError;
      }

      // ログイン成功のトースト表示
      toast({
        title: "ログインしました",
        description: "アプリへようこそ！",
      });

      // ナビゲーションは現在、App.tsxで処理されているため、ここでは行わない
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
