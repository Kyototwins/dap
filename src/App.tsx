
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import ProfileSetup from "./pages/ProfileSetup";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import UserProfile from "./pages/UserProfile";
import About from "./pages/About";
import Help from "./pages/Help";
import LearnMore from "./pages/LearnMore";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Digest from "./pages/Digest";
import { AppLayout } from "./components/layout/AppLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/learn-more" element={<LearnMore />} />
                <Route path="/matches" element={<AppLayout><Matches /></AppLayout>} />
                <Route path="/messages" element={<AppLayout><Messages /></AppLayout>} />
                <Route path="/events" element={<AppLayout><Events /></AppLayout>} />
                <Route path="/events/create" element={<AppLayout><CreateEvent /></AppLayout>} />
                <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
                <Route path="/profile/setup" element={<AppLayout><ProfileSetup /></AppLayout>} />
                <Route path="/profile/:id" element={<AppLayout><UserProfile /></AppLayout>} />
                <Route path="/about" element={<AppLayout><About /></AppLayout>} />
                <Route path="/help" element={<AppLayout><Help /></AppLayout>} />
                <Route path="/admin" element={<AppLayout><Admin /></AppLayout>} />
                <Route path="/digest" element={<AppLayout><Digest /></AppLayout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
