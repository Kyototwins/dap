
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, WifiOff, User, Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, connectionError, offline, handleSignUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast({
        title: "Input Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    // 大学メールアドレスかチェック
    if (!email.endsWith("@university.edu")) {
      toast({
        title: "Email Requirement",
        description: "Please use your university email address (ending with @university.edu).",
        variant: "destructive",
      });
      return;
    }
    await handleSignUp({ email, password, name });
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the international university community"
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
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="pl-10 bg-white/70 backdrop-blur-sm border-gray-200 focus-visible:ring-[#7f1184]"
              />
            </div>
          </div>
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
                disabled={loading}
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
                disabled={loading}
                minLength={8}
                className="pl-10 bg-white/70 backdrop-blur-sm border-gray-200 focus-visible:ring-[#7f1184]"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full transition-all duration-200 shadow-md hover:shadow-lg bg-[#7f1184] hover:bg-[#671073]" 
            disabled={loading || offline || connectionError}
          >
            {loading ? "Processing..." : "Create Account"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link
            to="/login"
            className="text-[#7f1184] font-medium hover:underline hover:text-[#671073] transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
