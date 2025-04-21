import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DapLogo } from "@/components/common/DapLogo";

export default function LearnMore() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white">
        <div>
          <DapLogo />
        </div>
        <button className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-4 flex items-center"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">About DAP</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600">
              DAP (Discover And Practice) is dedicated to connecting university students from around the world 
              for language exchange and cultural understanding. We believe that language learning is most 
              effective when practiced with native speakers in meaningful conversations about shared interests.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Why Choose DAP?</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Connect exclusively with verified university students</li>
              <li>Find partners based on language goals and common interests</li>
              <li>Practice through text, audio, and video chat</li>
              <li>Join language exchange events and study groups</li>
              <li>Build a global network of connections</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Success Stories</h2>
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <p className="italic text-gray-600 mb-4">
                "Thanks to DAP, I was able to improve my Japanese skills significantly before my 
                study abroad semester in Tokyo. I still keep in touch with my language partners, 
                who became real friends!"
              </p>
              <p className="font-medium">- Maria from Spain</p>
            </div>
          </section>
          
          <div className="flex justify-center pt-6">
            <Button
              className="bg-[#7f1184] hover:bg-[#671073] text-white px-8 py-6 text-lg"
              onClick={() => navigate("/signup")}
            >
              Join DAP Today
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-auto p-6 bg-gray-50 text-center text-gray-500 text-sm">
        <p>© 2025 DAP. All rights reserved.</p>
      </footer>
    </div>
  );
}
