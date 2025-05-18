
import { MessageSquare, User, Search, Calendar, Menu, HelpCircle, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DapLogo } from "@/components/common/DapLogo";
import { NotificationIndicator } from "@/components/common/NotificationIndicator";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasUnreadMessages, hasUnreadLikes, hasUnreadEvents } = useUnreadNotifications();
  const { handleLogout, isAuthenticated } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const lastPathRef = useRef(location.pathname);

  // Monitor and log navigation
  useEffect(() => {
    console.log("AppLayout rendered at path:", location.pathname);
    lastPathRef.current = location.pathname;
  }, [location.pathname]);

  // Auth redirect logic is now handled at the route level in App.tsx
  // This component will only render if the user is authenticated

  const navItems = [
    { icon: Search, label: "Matching", path: "/matches", hasNotification: hasUnreadLikes },
    { icon: MessageSquare, label: "Messages", path: "/messages", hasNotification: hasUnreadMessages },
    { icon: Calendar, label: "Events", path: "/events", hasNotification: hasUnreadEvents },
    { icon: User, label: "Profile", path: "/profile", hasNotification: false },
  ];

  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path} from: ${location.pathname}`);
    
    try {
      navigate(path);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleHelpClick = () => {
    console.log("Navigating to help page");
    navigate("/help");
  };

  const handleLogoutClick = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    try {
      setIsLoggingOut(true);
      console.log("Logging out...");
      
      // Show toast for feedback
      toast({
        title: "Logging out...",
        duration: 2000,
      });
      
      await handleLogout();
      
      // Success toast
      toast({
        title: "Successfully logged out",
        description: "Redirecting to login page...",
        duration: 3000,
      });
      
      // Explicitly navigate to login page after logout
      navigate('/login', { replace: true });
      console.log("Logged out and redirected to login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

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
                    onClick={handleHelpClick}
                  >
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Help
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-red-600 hover:text-red-600 hover:bg-red-50" 
                    onClick={handleLogoutClick}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
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
