
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
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
  const { loading, connectionError, offline, handleLogin, user } = useAuth();

  // ユーザーが既にログインしている場合はリダイレクト
  if (user && !isSubmitting) {
    console.log("User is already logged in, redirecting to matches");
    return <Navigate to="/matches" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Input Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await handleLogin({ email, password });
    } finally {
      // サーバーからのレスポンスを待っているうちにリダイレクトされないようにする
      // ログインが成功したら、useAuth hookのuser状態更新によって自動的にリダイレクトされる
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Start your international exchange journey"
    >
      <div className="animate-fade-up">
        {offline && (
          <Alert variant="destructive" className="mb-6 border-red-400">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              No internet connection. Please check your network.
            </AlertDescription>
          </Alert>
        )}
        
        {!offline && connectionError && (
          <Alert variant="destructive" className="mb-6 border-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Could not connect to the server. Please check your network.
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
            {isSubmitting ? "Logging in..." : loading ? "Processing..." : "Log In"}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <span className="text-muted-foreground text-sm">Don't have an account? </span> 
          <Link
            to="/signup"
            className="text-[#7f1184] font-medium hover:underline hover-lift inline-block transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
