
import { useIsMobile } from './use-mobile';
import { HomeScreenPrompt } from '@/components/common/HomeScreenPrompt';
import { HomeScreenPromptMobile } from '@/components/common/HomeScreenPromptMobile';

export function useHomeScreenPrompt() {
  const isMobile = useIsMobile();
  
  // Return null components to prevent the prompt from being displayed
  const HomeScreenPromptComponent = () => null;
  
  return { HomeScreenPromptComponent };
}
