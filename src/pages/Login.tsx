
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    toast({
      title: "Coming soon",
      description: "Login functionality will be implemented in the next iteration",
    });
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to connect with international students"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">University Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.name@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
      <div className="mt-6 text-center">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link
          to="/signup"
          className="text-primary hover:underline hover-lift inline-block"
        >
          Sign Up
        </Link>
      </div>
    </AuthLayout>
  );
}
