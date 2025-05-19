
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
import { NotificationProvider } from "@/contexts/NotificationContext";
import { FirebaseInitializer } from "@/components/notifications/FirebaseInitializer";
import { useHomeScreenPrompt } from "@/hooks/useHomeScreenPrompt";
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
import EmailConfirmation from "./pages/EmailConfirmation";

// Create a client
const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { HomeScreenPromptComponent } = useHomeScreenPrompt();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setShowPrompt(true); // ログイン時にプロンプトを表示
        }
        setSession(session);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setShowPrompt(true); // 既存のセッションがある場合もプロンプトを表示
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <TooltipProvider>
              {/* Initialize Firebase only if the user is logged in */}
              {session && <FirebaseInitializer />}
              
              {/* Show home screen prompt for logged in users */}
              {session && showPrompt && <HomeScreenPromptComponent />}
              
              <Routes>
                <Route path="/" element={session ? <Navigate to="/matches" /> : <Landing />} />
                <Route path="/login" element={session ? <Navigate to="/matches" /> : <Login />} />
                <Route path="/signup" element={session ? <Navigate to="/matches" /> : <SignUp />} />
                <Route path="/email-confirmation" element={<EmailConfirmation />} />
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
        </NotificationProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
