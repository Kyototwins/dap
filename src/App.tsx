
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
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

// Create a client
const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={session ? <Navigate to="/matches" /> : <Landing />} />
              <Route path="/login" element={session ? <Navigate to="/matches" /> : <Login />} />
              <Route path="/signup" element={session ? <Navigate to="/matches" /> : <SignUp />} />
              <Route path="/profile/setup" element={session ? <ProfileSetup /> : <Navigate to="/login" />} />
              <Route path="/help" element={session ? <Help /> : <Navigate to="/login" />} />
              
              {/* Protected routes - AppLayoutでラップ */}
              <Route
                path="/matches"
                element={
                  session ? (
                    <AppLayout>
                      <Matches />
                    </AppLayout>
                  ) : (
                    <Navigate to="/login" />
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
                    <Navigate to="/login" />
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
                    <Navigate to="/login" />
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
                    <Navigate to="/login" />
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
                    <Navigate to="/login" />
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
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
