
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { DapLogo } from "@/components/common/DapLogo";

export default function Landing() {
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    // Here you would check for an existing session
    // For now, just keeping a stub
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white">
        <div>
          <DapLogo />
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center p-6 py-16 bg-[#E5DEFF]">
        {/* PC中央タイトル: DAPのロゴではなくタイトル文なのでそのまま */}
        <h1 className="text-4xl font-bold text-center mb-2">
          Connect <span className="text-[#7f1184]">Beyond</span>
        </h1>
        <h1 className="text-4xl font-bold text-center mb-6">
          <span className="text-[#7f1184]">Borders</span>
        </h1>
        <p className="text-gray-600 text-center max-w-md mb-8">
          Join DAP, where university students worldwide connect for language
          exchange, cultural understanding, and meaningful friendships.
        </p>
        <div className="flex flex-col w-full max-w-xs gap-3">
          <Button
            className="bg-[#7f1184] hover:bg-[#671073] text-white w-full py-6 text-lg"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </Button>
          <Button
            variant="outline"
            className="bg-transparent text-foreground border-border hover:bg-gray-100 w-full py-6 text-lg"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </section>

      {/* How It Works - moved right after buttons */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How DAP Works</h2>
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-[#7f1184]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Create Your Profile</h3>
            <p className="text-gray-600 text-center">
              Share your language skills, interests, and what you're looking for in a language exchange partner.
            </p>
          </div>
          {/* Step 2 */}
          <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7f1184]"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Find Connections</h3>
            <p className="text-gray-600 text-center">
              Discover students with complementary language skills and shared interests from universities worldwide.
            </p>
          </div>
          {/* Step 3 */}
          <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7f1184]"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Start Conversations</h3>
            <p className="text-gray-600 text-center">
              Connect through our messaging system and begin your language and cultural exchange journey.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-12 mt-4 bg-[#7f1184] text-white">
        <div className="max-w-md mx-auto text-center py-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Connect Globally?</h2>
          <p className="mb-8">
            Join thousands of university students already expanding their horizons through language and cultural exchange.
          </p>
          <Button 
            variant="outline" 
            className="bg-white text-[#7f1184] border-white hover:bg-gray-100 px-8 py-6 text-lg w-full"
            onClick={() => navigate("/signup")}
          >
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 bg-gray-50 text-center text-gray-500 text-sm">
        <p>© 2025 DAP. All rights reserved.</p>
      </footer>
    </div>
  );
}
