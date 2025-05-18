
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';
import { HomeScreenPrompt } from '@/components/common/HomeScreenPrompt';
import { HomeScreenPromptMobile } from '@/components/common/HomeScreenPromptMobile';
import { HomeScreenWidgetPrompt } from '@/components/common/HomeScreenWidgetPrompt';

export function useHomeScreenPrompt() {
  const isMobile = useIsMobile();
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const [shouldShowWidgetPrompt, setShouldShowWidgetPrompt] = useState(false);
  
  useEffect(() => {
    // Check if we should show the prompt
    const hasShownPrompt = localStorage.getItem("hasShownHomeScreenPrompt");
    
    if (!hasShownPrompt) {
      // Small delay to ensure it appears after app has loaded
      const timer = setTimeout(() => {
        // Only show for mobile devices that aren't already in standalone mode
        const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
        
        // Check if it's iOS or Android (don't show for other platforms)
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isAndroid = /Android/i.test(navigator.userAgent);
        
        // Check if it's not a Windows Phone
        const isWindowsPhone = navigator.userAgent.indexOf("Windows Phone") !== -1 || 
          (typeof (window as any).MSStream !== 'undefined');
        
        if (isMobileDevice && !isStandalone && !isWindowsPhone && (isIOS || isAndroid)) {
          setShouldShowPrompt(true);
        } else {
          // Mark as shown for non-mobile devices
          localStorage.setItem("hasShownHomeScreenPrompt", "true");
        }
      }, 2000); // 2-second delay
      
      return () => clearTimeout(timer);
    }
    
    // We're no longer showing the widget prompt
    setShouldShowWidgetPrompt(false);
  }, []);
  
  // Return the appropriate component based on device type
  const HomeScreenPromptComponent = isMobile 
    ? HomeScreenPromptMobile 
    : HomeScreenPrompt;
  
  return { 
    shouldShowPrompt,
    setShouldShowPrompt,
    HomeScreenPromptComponent
  };
}
