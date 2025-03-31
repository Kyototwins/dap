
import { MessageSquare, User, Search, Calendar, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface LayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Search, label: "マッチング", path: "/matches" },
    { icon: MessageSquare, label: "メッセージ", path: "/messages" },
    { icon: Calendar, label: "イベント", path: "/events" },
    { icon: User, label: "プロフィール", path: "/profile" },
  ];

  // Get the title based on current path
  const getPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath.startsWith("/matches")) return "マッチング";
    if (currentPath.startsWith("/messages")) return "メッセージ";
    if (currentPath.startsWith("/events/new")) return "イベントを作成";
    if (currentPath.startsWith("/events")) return "イベント";
    if (currentPath.startsWith("/profile")) return "プロフィール";
    return "DAP";
  };

  return (
    <div className="min-h-screen pb-16">
      {/* ヘッダー */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-white border-b border-gray-200">
        <div className="container max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-dap-blue">DAP</h1>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <button className="p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container max-w-lg mx-auto px-4 pt-16 pb-4">
        {children}
      </main>

      {/* ナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="container max-w-lg mx-auto">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1",
                  "text-gray-500 hover:text-dap-blue transition-colors",
                  location.pathname === item.path && "text-dap-blue font-medium"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  location.pathname === item.path && "text-dap-blue"
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
