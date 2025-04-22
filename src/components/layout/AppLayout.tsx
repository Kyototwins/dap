
import { MessageSquare, User, Search, Calendar } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { DapLogo } from "@/components/common/DapLogo";

interface LayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Search, label: "Matching", path: "/matches" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  // ナビゲーション処理を更新
  const handleNavigation = (path: string) => {
    // メッセージボタンを押した時、強制的にクエリパラメータなしでナビゲートする
    if (path === "/messages") {
      // メッセージは常にリスト表示から始める（クエリパラメータを削除）
      navigate("/messages", { replace: true });
      console.log("Navigating to messages list view");
    } else {
      // 他のパスは通常通りナビゲート
      navigate(path, { replace: true });
    }
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath.startsWith("/matches")) return "Matching";
    if (currentPath.startsWith("/messages")) return "Messages";
    if (currentPath.startsWith("/events/new")) return "Create Event";
    if (currentPath.startsWith("/events")) return "Events";
    if (currentPath.startsWith("/profile")) return "Profile";
    return "DAP";
  };

  return (
    <div className="min-h-screen pb-16">
      <header className="fixed top-0 right-0 left-0 z-50 bg-white border-b border-gray-200">
        <div className="container max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div>
            <DapLogo />
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <NotificationBell />
          </div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 pt-16 pb-4">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="container max-w-lg mx-auto">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1",
                  "text-gray-500 hover:text-doshisha-purple transition-colors",
                  location.pathname === item.path && "text-doshisha-purple font-medium"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  location.pathname === item.path && "text-doshisha-purple"
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
