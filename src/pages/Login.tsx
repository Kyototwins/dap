
import { useState, useEffect } from "react";
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
  const { loading, connectionError, offline, handleLogin, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check for authenticated user and redirect
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated in Login page, redirecting to matches", user?.id);
      navigate("/matches", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

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
      console.log("Attempting login with email:", email);
      await handleLogin({ email, password });
      
      // Show success toast
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigate is handled in the useEffect based on authentication state
    } catch (error: any) {
      console.error("Login submission error:", error);
      // Error handling is already in handleLogin but we can add more specific feedback
      let errorMessage = "Login failed. Please check your credentials and try again.";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If we're loading auth state, show a simple loading message
  if (loading && !isSubmitting) {
    return (
      <AuthLayout title="Welcome Back" subtitle="Start your international exchange journey">
        <div className="animate-fade-up flex justify-center py-12">
          <p>Loading...</p>
        </div>
      </AuthLayout>
    );
  }

  // Don't render login form if user is authenticated and not loading
  if (isAuthenticated) {
    console.log("User authenticated, rendering null");
    return null;
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Start your international exchange journey">
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
