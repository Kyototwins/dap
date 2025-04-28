
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DapLogo } from "@/components/common/DapLogo";

export default function About() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex justify-between items-center p-4 bg-white border-b">
        <div>
          <DapLogo />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-4 flex items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">About DAP</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600">
              DAP (Discover And Practice) is dedicated to connecting university students from around the world 
              for language exchange and cultural understanding.
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
        </div>
      </div>
    </div>
  );
}
