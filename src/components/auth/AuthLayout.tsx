
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 animate-fade-up">
        <h1 className="text-3xl font-semibold text-center mb-2">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground text-center mb-6">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}
