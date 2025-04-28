
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DapLogo } from "@/components/common/DapLogo";

export default function Help() {
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
        
        <h1 className="text-3xl font-bold mb-6">Help Center</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="text-gray-600">
              Learn how to make the most of DAP with our quick start guide.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">How do I find language partners?</h3>
                <p className="text-gray-600">
                  Use our matching system to find partners who share your language learning goals.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">How do I join events?</h3>
                <p className="text-gray-600">
                  Browse available events in the Events tab and click "Join" to participate.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
