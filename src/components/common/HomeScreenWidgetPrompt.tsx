
import { useEffect, useState } from "react";
import { Smartphone, Globe, Tablet, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function HomeScreenWidgetPrompt() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  
  useEffect(() => {
    // Show the popover after a 1 second delay
    const timer = setTimeout(() => {
      setOpen(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (dontShowAgain = false) => {
    setOpen(false);
    
    if (dontShowAgain) {
      localStorage.setItem("hasShownWidgetPrompt", "true");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="hidden">
        {/* Hidden trigger */}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[70vw] p-0 mx-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-xl border-0 overflow-hidden"
        align="center"
      >
        <div className="flex flex-col">
          {/* Header section with purple background */}
          <div className="bg-doshisha-purple text-white p-4 text-center">
            <h3 className="text-xl font-bold">{t("homeScreen.title")}</h3>
          </div>
          
          {/* Content section */}
          <div className="p-5 space-y-4">
            {/* App name with icon */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <Globe className="h-10 w-10 text-doshisha-purple" />
              <h2 className="text-2xl font-bold text-black">{t("app.name")}</h2>
            </div>
            
            <p className="text-center text-lg font-medium">
              {t("homeScreen.widget.subtitle")}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Android instructions */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 font-bold mb-2">
                  <Smartphone className="h-6 w-6" />
                  <h4>Android</h4>
                </div>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>{t("homeScreen.android.step1")}</li>
                  <li>{t("homeScreen.android.step2")}</li>
                  <li>{t("homeScreen.android.step3")}</li>
                </ol>
              </div>
              
              {/* iOS instructions */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 font-bold mb-2">
                  <Tablet className="h-6 w-6" />
                  <h4>iPhone (Safari)</h4>
                </div>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>{t("homeScreen.ios.step1")}</li>
                  <li>{t("homeScreen.ios.step2")}</li>
                  <li>{t("homeScreen.ios.step3")}</li>
                </ol>
              </div>
            </div>
          </div>
          
          {/* Button section */}
          <div className="p-4 flex flex-col gap-2">
            <Button 
              className="w-full bg-doshisha-purple hover:bg-doshisha-purple/90 py-3 text-lg" 
              onClick={() => handleDismiss()}
            >
              {t("homeScreen.gotIt")}
            </Button>
            <Button
              variant="outline"
              className="w-full border border-gray-200 py-3 text-lg" 
              onClick={() => handleDismiss(true)}
            >
              {t("homeScreen.dontShowAgain")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
