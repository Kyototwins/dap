
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef, ReactNode } from "react";
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
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Route guard to protect authenticated routes
function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    // Redirect to login page with current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Route guard to redirect authenticated users away from public routes
function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/matches" replace />;
  }
  
  return <>{children}</>;
}

function AuthenticatedApp() {
  const { user, session, loading } = useAuth();
  const [notificationsInitialized, setNotificationsInitialized] = useState(false);
  const initialCheckDone = useRef(false);

  // Initialize notifications when authenticated
  useEffect(() => {
    if (user && session && !notificationsInitialized) {
      console.log("Initializing notifications for authenticated user", user.id);
      // Use timeout to avoid blocking the main rendering process
      const timer = setTimeout(() => {
        initializeNotificationsIfNeeded();
        setNotificationsInitialized(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [user, session, notificationsInitialized]);

  // Log authentication status for debugging
  useEffect(() => {
    if (!initialCheckDone.current) {
      console.log("Initial auth check in AuthenticatedApp:", {
        isLoading: loading,
        hasUser: !!user,
        hasSession: !!session,
        userId: user?.id
      });
      initialCheckDone.current = true;
    }
  }, [user, session, loading]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      <Route 
        path="/" 
        element={
          <RedirectIfAuthenticated>
            <Landing />
          </RedirectIfAuthenticated>
        } 
      />
      <Route 
        path="/login" 
        element={
          <RedirectIfAuthenticated>
            <Login />
          </RedirectIfAuthenticated>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <RedirectIfAuthenticated>
            <SignUp />
          </RedirectIfAuthenticated>
        } 
      />
      
      {/* Protected routes that require authentication */}
      <Route 
        path="/profile/setup" 
        element={
          <RequireAuth>
            <ProfileSetup />
          </RequireAuth>
        } 
      />
      <Route 
        path="/help" 
        element={
          <RequireAuth>
            <Help />
          </RequireAuth>
        } 
      />
      
      {/* Protected routes - AppLayout wrapper */}
      <Route 
        path="/matches" 
        element={
          <RequireAuth>
            <AppLayout>
              <Matches />
            </AppLayout>
          </RequireAuth>
        } 
      />
      <Route 
        path="/messages" 
        element={
          <RequireAuth>
            <AppLayout>
              <Messages />
            </AppLayout>
          </RequireAuth>
        } 
      />
      <Route 
        path="/events" 
        element={
          <RequireAuth>
            <AppLayout>
              <Events />
            </AppLayout>
          </RequireAuth>
        } 
      />
      <Route 
        path="/events/new" 
        element={
          <RequireAuth>
            <AppLayout>
              <CreateEvent />
            </AppLayout>
          </RequireAuth>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <RequireAuth>
            <AppLayout>
              <Profile />
            </AppLayout>
          </RequireAuth>
        } 
      />
      <Route 
        path="/profile/:id" 
        element={
          <RequireAuth>
            <AppLayout>
              <UserProfile />
            </AppLayout>
          </RequireAuth>
        } 
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
