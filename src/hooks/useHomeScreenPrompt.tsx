
import { useIsMobile } from './use-mobile';
import { HomeScreenPrompt } from '@/components/common/HomeScreenPrompt';
import { HomeScreenPromptMobile } from '@/components/common/HomeScreenPromptMobile';

export function useHomeScreenPrompt() {
  const isMobile = useIsMobile();
  
  // Return the appropriate component based on device type
  const HomeScreenPromptComponent = isMobile 
    ? HomeScreenPromptMobile 
    : HomeScreenPrompt;
  
  return { HomeScreenPromptComponent };
}
