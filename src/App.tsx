
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Matches from "./pages/Matches";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <TooltipProvider>
              <Routes>
                {/* Always redirect to matches page */}
                <Route path="/" element={<Navigate to="/matches" replace />} />
                
                {/* Render pages inside AppLayout */}
                <Route 
                  path="/matches" 
                  element={
                    <AppLayout>
                      <Matches />
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

                {/* Catch all other routes and redirect to matches */}
                <Route path="*" element={<Navigate to="/matches" replace />} />
              </Routes>
            </TooltipProvider>
          </BrowserRouter>
        </NotificationProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
