
import { MessageSquare, User, Search, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Search, label: "マッチング", path: "/matches" },
    { icon: MessageSquare, label: "メッセージ", path: "/messages" },
    { icon: Plus, label: "イベント", path: "/events" },
    { icon: User, label: "プロフィール", path: "/profile" },
  ];

  return (
    <div className="min-h-screen pb-16">
      <main className="container max-w-lg mx-auto px-4">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="container max-w-lg mx-auto">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1",
                  "text-muted-foreground hover:text-foreground transition-colors",
                  location.pathname === item.path && "text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
