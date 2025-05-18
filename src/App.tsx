
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { supabase } from './integrations/supabase/client';
import Matches from './pages/Matches';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Events from './pages/Events';
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseInitializer } from "@/components/notifications/FirebaseInitializer";
import Login from './pages/Login';
import { AppLayout } from './components/layout/AppLayout';

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <>
      {/* 非表示の Firebase 初期化コンポーネント */}
      <FirebaseInitializer />

      <NotificationProvider>
        <Router>
          <div className="container" style={{ padding: '50px 0 100px 0' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/matches" />} />
              <Route path="/events" element={<Events />} />
              <Route
                path="/login"
                element={
                  !session ? (
                    <Login />
                  ) : (
                    <Navigate to="/matches" />
                  )
                }
              />
              <Route
                path="/matches"
                element={
                  session ? (
                    <AppLayout><Matches /></AppLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  session ? (
                    <AppLayout><Profile /></AppLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
               <Route
                path="/profile/:userId"
                element={
                  session ? (
                    <AppLayout><Profile /></AppLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/messages"
                element={
                  session ? (
                    <AppLayout><Messages /></AppLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          </div>
        </Router>
        <Toaster />
      </NotificationProvider>
    </>
  );
}

export default App;
