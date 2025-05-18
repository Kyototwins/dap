import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from './integrations/supabase/client';
import Account from './pages/Account';
import Home from './pages/Home';
import Login from './pages/Login';
import Matches from './pages/Matches';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Events from './pages/Events';
import OfferedExperiences from './pages/OfferedExperiences';
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Toaster } from "@/components/ui/toaster"
import { FirebaseInitializer } from "@/components/notifications/FirebaseInitializer";

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
              <Route exact path="/" element={<Home />} />
              <Route exact path="/events" element={<Events />} />
              <Route exact path="/experiences" element={<OfferedExperiences />} />
              <Route
                path="/login"
                element={
                  !session ? (
                    <Login />
                  ) : (
                    <Navigate to="/account" />
                  )
                }
              />
              <Route
                path="/account"
                element={
                  session ? (
                    <Account session={session} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  session ? (
                    <Profile session={session} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
               <Route
                path="/profile/:userId"
                element={
                  session ? (
                    <Profile session={session} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/matches"
                element={
                  session ? (
                    <Matches session={session} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/messages"
                element={
                  session ? (
                    <Messages session={session} />
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
