
import { MessageSquare, User, Search, Calendar, Menu, HelpCircle, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DapLogo } from "@/components/common/DapLogo";
import { NotificationIndicator } from "@/components/common/NotificationIndicator";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasUnreadMessages, hasUnreadLikes, hasUnreadEvents } = useUnreadNotifications();
  const { handleLogout, isAuthenticated, loading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("User not authenticated in AppLayout, redirecting to login");
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const navItems = [
    { icon: Search, label: "Matching", path: "/matches", hasNotification: hasUnreadLikes },
    { icon: MessageSquare, label: "Messages", path: "/messages", hasNotification: hasUnreadMessages },
    { icon: Calendar, label: "Events", path: "/events", hasNotification: hasUnreadEvents },
    { icon: User, label: "Profile", path: "/profile", hasNotification: false },
  ];

  const handleNavigation = (path: string) => {
    if (path === "/messages") {
      navigate("/messages", { replace: true });
      console.log("Navigating to messages list view");
    } else {
      navigate(path, { replace: true });
    }
  };

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      // Navigate to the home page after logout
      navigate('/', { replace: true });
      console.log("Logged out and redirected to home page");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Don't render anything, the useEffect will handle redirection
  }

  return (
    <div className="min-h-screen pb-16">
      <header className="fixed top-0 right-0 left-0 z-50 bg-white border-b border-gray-200">
        <div className="container max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div>
            <DapLogo />
          </div>
          <div className="flex items-center gap-2">
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
                    onClick={handleLogoutClick}
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
                <item.icon className={cn(
                  "w-5 h-5",
                  location.pathname === item.path && "text-doshisha-purple"
                )} />
                <span className="text-xs">{item.label}</span>
                {item.hasNotification && <NotificationIndicator className="bg-blue-500" />}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
