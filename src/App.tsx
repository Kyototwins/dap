
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { supabase } from './integrations/supabase/client';
import Home from './pages/Home';
import Login from './pages/Login';
import Matches from './pages/Matches';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Events from './pages/Events';
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      <NotificationProvider>
        <Router>
          <div className="container" style={{ padding: '50px 0 100px 0' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route 
                path="/login" 
                element={!session ? <Login /> : <Navigate to="/profile" />} 
              />
              <Route 
                path="/profile" 
                element={session ? <Profile /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/matches" 
                element={session ? <Matches /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/messages" 
                element={session ? <Messages /> : <Navigate to="/login" />} 
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
