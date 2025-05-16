
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
import { NotificationProvider } from "./contexts/NotificationContext";

// 通知の初期化関数を別ファイルからインポートするが、直接呼び出さない
// （後でimportした関数を使う）
import { initializeNotificationsIfNeeded } from "./initNotifications";

// Create a client
const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 認証状態のリスナーを設定（最初に実行）
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      console.log("App: Auth state changed", _event);
      setSession(currentSession);
      
      // 通知の初期化をセッションがある場合のみ非同期で実行
      if (currentSession) {
        // 非同期処理を分離して、メインの認証ループを妨げないようにする
        setTimeout(() => {
          console.log("Initializing notifications after auth change");
          initializeNotificationsIfNeeded();
        }, 100);
      }
    });

    // 既存のセッションを確認
    const getInitialSession = async () => {
      try {
        console.log("App: Getting initial session");
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        // 通知の初期化をセッションがある場合のみ実行
        if (data.session) {
          // 非同期処理を分離
          setTimeout(() => {
            console.log("Initializing notifications after initial session");
            initializeNotificationsIfNeeded();
          }, 100);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    // ローディング表示をより明確に
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>;
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
