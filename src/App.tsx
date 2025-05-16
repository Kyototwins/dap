
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Session } from "@supabase/supabase-js"; // Add this import for the Session type
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
import { NotificationProvider } from "./contexts/NotificationContext";

// Create a client
const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      // Initialize notifications on sign in
      if (session) {
        setTimeout(() => {
          initializeNotificationsIfNeeded();
        }, 0);
      }
    });

    // THEN check current session
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        // Initialize notifications if user is logged in
        if (data.session) {
          initializeNotificationsIfNeeded();
        }
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <TooltipProvider>
              <Routes>
                <Route path="/" element={session ? <Navigate to="/matches" replace /> : <Landing />} />
                <Route path="/login" element={session ? <Navigate to="/matches" replace /> : <Login />} />
                <Route path="/signup" element={session ? <Navigate to="/matches" replace /> : <SignUp />} />
                <Route path="/profile/setup" element={session ? <ProfileSetup /> : <Navigate to="/login" replace />} />
                <Route path="/help" element={session ? <Help /> : <Navigate to="/login" replace />} />
                
                {/* Protected routes - AppLayoutでラップ */}
                <Route
                  path="/matches"
                  element={
                    session ? (
                      <AppLayout>
                        <Matches />
                      </AppLayout>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/messages"
                  element={
                    session ? (
                      <AppLayout>
                        <Messages />
                      </AppLayout>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/events"
                  element={
                    session ? (
                      <AppLayout>
                        <Events />
                      </AppLayout>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/events/new"
                  element={
                    session ? (
                      <AppLayout>
                        <CreateEvent />
                      </AppLayout>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/profile"
                  element={
                    session ? (
                      <AppLayout>
                        <Profile />
                      </AppLayout>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/profile/:id"
                  element={
                    session ? (
                      <AppLayout>
                        <UserProfile />
                      </AppLayout>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </BrowserRouter>
        </NotificationProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
