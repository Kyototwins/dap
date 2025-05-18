
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, WifiOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading, authReady, connectionError, offline, handleLogin, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const hasRedirectedRef = useRef(false);
  const loginProcessingRef = useRef(false);

  // Check for authenticated user and redirect only once
  useEffect(() => {
    if (!authReady) {
      console.log("Auth not ready yet, waiting...");
      return; // Wait until auth is ready
    }
    
    console.log("Login page auth check:", { 
      isAuthenticated: isAuthenticated, 
      authReady: authReady,
      isSubmitting: isSubmitting, 
      hasRedirected: hasRedirectedRef.current,
      loginProcessing: loginProcessingRef.current
    });
    
    // Only redirect if authenticated, not in login process, and not already redirected
    if (isAuthenticated && authReady && !loginProcessingRef.current && !hasRedirectedRef.current) {
      console.log("User is authenticated in Login page, redirecting to matches", user?.id);
      hasRedirectedRef.current = true;
      
      // Use a small delay to avoid race conditions
      setTimeout(() => {
        navigate("/matches", { replace: true });
      }, 50);
    }
  }, [isAuthenticated, user, navigate, isSubmitting, authReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "入力エラー",
        description: "メールアドレスとパスワードを入力してください。",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    loginProcessingRef.current = true;
    hasRedirectedRef.current = false;
    
    try {
      console.log("Attempting login with email:", email);
      const result = await handleLogin({ email, password });
      
      if (result?.user) {
        // Show success toast
        toast({
          title: "ログイン成功",
          description: "おかえりなさい！",
        });
        
        console.log("Login successful, user ID:", result.user.id);
        
        // Force redirect to matches page after successful login
        hasRedirectedRef.current = true;
        setTimeout(() => {
          navigate("/matches", { replace: true });
        }, 100);
      }
    } catch (error: any) {
      console.error("Login submission error:", error);
      loginProcessingRef.current = false;
      hasRedirectedRef.current = false;
      
      let errorMessage = "ログインに失敗しました。認証情報を確認してください。";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "ログインエラー",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        loginProcessingRef.current = false;
      }, 500);
    }
  };

  // If we're loading auth state, show a simple loading message
  if ((loading && !isSubmitting) || !authReady) {
    return (
      <AuthLayout title="Welcome Back" subtitle="Start your international exchange journey">
        <div className="animate-fade-up flex justify-center py-12">
          <p>読み込み中...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Start your international exchange journey">
      <div className="animate-fade-up">
        {offline && (
          <Alert variant="destructive" className="mb-6 border-red-400">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              インターネット接続がありません。ネットワーク接続を確認してください。
            </AlertDescription>
          </Alert>
        )}
        
        {!offline && connectionError && (
          <Alert variant="destructive" className="mb-6 border-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              サーバーに接続できませんでした。ネットワーク接続を確認してください。
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">University Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your.name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || isSubmitting}
                className="pl-10 bg-white/70 backdrop-blur-sm border-gray-200 focus-visible:ring-[#7f1184]"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || isSubmitting}
                className="pl-10 bg-white/70 backdrop-blur-sm border-gray-200 focus-visible:ring-[#7f1184]"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full transition-all duration-200 shadow-md hover:shadow-lg bg-[#7f1184] hover:bg-[#671073]" 
            disabled={loading || offline || connectionError || isSubmitting}
          >
            {isSubmitting ? "ログイン中..." : loading ? "処理中..." : "ログイン"}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <span className="text-muted-foreground text-sm">アカウントをお持ちでないですか？ </span> 
          <Link
            to="/signup"
            className="text-[#7f1184] font-medium hover:underline hover-lift inline-block transition-all"
          >
            登録する
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
