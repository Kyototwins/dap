
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import ProfileSetup from "./pages/ProfileSetup";
import SignUp from "./pages/SignUp";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import Landing from "./pages/Landing";
import About from "./pages/About";
import LearnMore from "./pages/LearnMore";
import Index from "./pages/Index";
import { testSupabaseConnection } from "./integrations/supabase/client";
import "./startup/addNotificationEmailField";

function App() {
  useEffect(() => {
    const testConnection = async () => {
      const { success } = await testSupabaseConnection();
      console.log(`Supabase connection test: ${success ? "Success" : "Failed"}`);
    };
    
    testConnection();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Index />} />
          <Route path="help" element={<Help />} />
          <Route path="matches" element={<Matches />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:matchId" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<UserProfile />} />
          <Route path="profile/setup" element={<ProfileSetup />} />
          <Route path="events" element={<Events />} />
          <Route path="events/create" element={<CreateEvent />} />
          <Route path="about" element={<About />} />
          <Route path="learn-more" element={<LearnMore />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
