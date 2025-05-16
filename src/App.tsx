
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { useAuth } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProfileSetup from "./pages/ProfileSetup";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Help from "./pages/Help";
import { initializeNotificationsIfNeeded } from "./initNotifications";

// Create a client
const queryClient = new QueryClient();

function AuthenticatedApp() {
  const { user, session, loading } = useAuth();
  const [notificationsInitialized, setNotificationsInitialized] = useState(false);

  // Initialize notifications when authenticated
  useEffect(() => {
    if (user && session && !notificationsInitialized) {
      console.log("Initializing notifications for authenticated user");
      // Use timeout to avoid blocking the main rendering process
      const timer = setTimeout(() => {
        initializeNotificationsIfNeeded();
        setNotificationsInitialized(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [user, session, notificationsInitialized]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      <Route path="/" element={user ? <Navigate to="/matches" replace /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/matches" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/matches" replace /> : <SignUp />} />
      
      {/* Protected routes that require authentication */}
      <Route 
        path="/profile/setup" 
        element={user ? <ProfileSetup /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/help" 
        element={user ? <Help /> : <Navigate to="/login" replace />} 
      />
      
      {/* Protected routes - AppLayout wrapper */}
      <Route 
        path="/matches" 
        element={user ? <AppLayout><Matches /></AppLayout> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/messages" 
        element={user ? <AppLayout><Messages /></AppLayout> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/events" 
        element={user ? <AppLayout><Events /></AppLayout> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/events/new" 
        element={user ? <AppLayout><CreateEvent /></AppLayout> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/profile" 
        element={user ? <AppLayout><Profile /></AppLayout> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/profile/:id" 
        element={user ? <AppLayout><UserProfile /></AppLayout> : <Navigate to="/login" replace />} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <TooltipProvider>
              <AuthenticatedApp />
            </TooltipProvider>
          </BrowserRouter>
        </NotificationProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
