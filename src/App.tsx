
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Landing from "./pages/Landing";
import LearnMore from "./pages/LearnMore";
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

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <NotificationProvider>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/learn-more" element={<LearnMore />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile/setup" element={<ProfileSetup />} />
                
                {/* アプリのメイン画面 - AppLayoutでラップ */}
                <Route
                  path="/matches"
                  element={
                    <AppLayout>
                      <Matches />
                    </AppLayout>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <AppLayout>
                      <Messages />
                    </AppLayout>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <AppLayout>
                      <Events />
                    </AppLayout>
                  }
                />
                <Route
                  path="/events/new"
                  element={
                    <AppLayout>
                      <CreateEvent />
                    </AppLayout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  }
                />
                <Route
                  path="/profile/:id"
                  element={
                    <AppLayout>
                      <UserProfile />
                    </AppLayout>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </NotificationProvider>
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
