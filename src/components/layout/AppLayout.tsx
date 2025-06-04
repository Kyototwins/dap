
import { MessageSquare, User, Search, Calendar, Menu, HelpCircle, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { DapLogo } from "@/components/common/DapLogo";
import { AdminLink } from "@/components/layout/AdminLink";
import { TutorialManager } from "@/components/tutorials/TutorialManager";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useUnreadCounts } from "@/hooks/useUnreadCounts";

interface LayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadMatches, unreadMessages, unreadEvents } = useUnreadCounts();

  const navItems = [
    { 
      icon: Search, 
      label: "Matching", 
      path: "/matches",
      badge: unreadMatches
    },
    { 
      icon: MessageSquare, 
      label: "Messages", 
      path: "/messages",
      badge: unreadMessages
    },
    { 
      icon: Calendar, 
      label: "Events", 
      path: "/events",
      badge: unreadEvents
    },
    { 
      icon: User, 
      label: "Profile", 
      path: "/profile",
      badge: 0
    },
  ];

  const handleNavigation = (path: string) => {
    if (path === "/messages") {
      navigate("/messages", { replace: true });
      console.log("Navigating to messages list view");
    } else {
      navigate(path, { replace: true });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <TutorialManager />
      
      <header className="fixed top-0 right-0 left-0 z-50 bg-white border-b border-gray-200">
        <div className="container max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div>
            <DapLogo />
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <AdminLink />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <Button 
                    variant="ghost" 
                    className="justify-start" 
                    onClick={() => navigate("/help")}
                  >
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Help
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-red-600 hover:text-red-600 hover:bg-red-50" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
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
                  "flex flex-col items-center justify-center w-full h-full gap-1 relative",
                  "text-gray-500 hover:text-doshisha-purple transition-colors",
                  location.pathname === item.path && "text-doshisha-purple font-medium"
                )}
              >
                <div className="relative">
                  <item.icon className={cn(
                    "w-5 h-5",
                    location.pathname === item.path && "text-doshisha-purple"
                  )} />
                  {item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
