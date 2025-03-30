
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
      {/* ヘッダー */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-600/10 shadow-sm">
        <div className="container max-w-lg mx-auto px-4 h-16 flex items-center">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/65f3a573-3b4d-4ec7-90e5-78fab77b800d.png"
              alt="DAP Logo"
              className="w-8 h-8"
            />
            <span className="font-bold text-xl text-amber-600">DAP</span>
          </div>
          <div className="flex-1" />
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container max-w-lg mx-auto px-4 pt-20 pb-4 animate-fade-up">
        {children}
      </main>

      {/* ナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-amber-600/10 shadow-md">
        <div className="container max-w-lg mx-auto">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1",
                  "text-muted-foreground hover:text-amber-600 transition-colors btn-hover-effect",
                  location.pathname === item.path && "text-amber-600 font-medium"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  location.pathname === item.path && "text-amber-600"
                )} />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
