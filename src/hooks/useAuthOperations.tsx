
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
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
      // Check offline status
      if (offline) {
        throw new Error("インターネット接続がありません。ネットワーク接続を確認してください。");
      }

      // Test connection
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error("サーバーに接続できません。ネットワーク接続を確認してください。");
      }

      // Signup process
      console.log("Attempting to sign up user:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.error("Signup API error:", error);
        throw error;
      }

      console.log("Signup successful, data:", data);

      // Show success message
      toast({
        title: "確認メールを送信しました",
        description: "メールに記載されているリンクをクリックして、登録を完了してください。",
      });

      // Redirect to login page
      navigate("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
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
      console.log("Login attempt for:", email);
      
      // Check offline status
      if (offline) {
        throw new Error("インターネット接続がありません。ネットワーク接続を確認してください。");
      }

      // Test connection
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error("サーバーに接続できません。ネットワーク接続を確認してください。");
      }

      // Login process with more verbose logging
      console.log("Connection verified, attempting to authenticate...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Authentication error:", error);
        throw error;
      }
      
      console.log("Authentication successful, session created:", !!data.session);
      
      // Login success toast
      toast({
        title: "ログインしました",
        description: "アプリへようこそ！",
      });
      
      console.log("Login successful, user is now authenticated");
      // Navigation will be handled by the auth state change listener in App.tsx
    } catch (error: any) {
      console.error("Login error:", error);
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
      
      return Promise.reject(error);
    } finally {
      console.log("Login process completed, releasing loading state");
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
