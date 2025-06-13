import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TutorialState {
  homeScreenTutorial: 'show' | 'remind_later' | 'never_show';
  emailNotificationTutorial: 'show' | 'remind_later' | 'never_show';
  instagramFollowTutorial: 'show' | 'remind_later' | 'never_show';
  emailNotificationDismissedAt?: string;
}

export function useTutorialPopovers() {
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    homeScreenTutorial: 'show',
    emailNotificationTutorial: 'show',
    instagramFollowTutorial: 'show'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTutorialState();
  }, []);

  const loadTutorialState = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile && (profile as any).tutorial_settings) {
        const currentSettings = (profile as any).tutorial_settings as TutorialState;
        const today = new Date().toISOString().split('T')[0];
        
        // Convert remind_later back to show on new login
        // For emailNotificationTutorial, only convert back to show if it was never_show before today
        const updatedSettings = {
          homeScreenTutorial: currentSettings.homeScreenTutorial === 'remind_later' ? 'show' : currentSettings.homeScreenTutorial,
          emailNotificationTutorial: (() => {
            if (currentSettings.emailNotificationTutorial === 'remind_later') {
              return 'show';
            }
            if (currentSettings.emailNotificationTutorial === 'never_show') {
              const dismissedAt = currentSettings.emailNotificationDismissedAt;
              // If dismissed before today, show again. If dismissed today or later, keep hidden
              if (!dismissedAt || dismissedAt < today) {
                return 'show';
              }
            }
            return currentSettings.emailNotificationTutorial;
          })(),
          instagramFollowTutorial: currentSettings.instagramFollowTutorial === 'remind_later' ? 'show' : currentSettings.instagramFollowTutorial || 'show',
          emailNotificationDismissedAt: currentSettings.emailNotificationDismissedAt
        };

        // Update database if there were any remind_later statuses or if emailNotificationTutorial was never_show from before today
        const shouldUpdate = currentSettings.homeScreenTutorial === 'remind_later' || 
            currentSettings.emailNotificationTutorial === 'remind_later' ||
            currentSettings.instagramFollowTutorial === 'remind_later' ||
            (currentSettings.emailNotificationTutorial === 'never_show' && 
             (!currentSettings.emailNotificationDismissedAt || currentSettings.emailNotificationDismissedAt < today));

        if (shouldUpdate) {
          await supabase
            .from('profiles')
            .update({ tutorial_settings: updatedSettings } as any)
            .eq('id', user.id);
        }

        setTutorialState(updatedSettings);
      }
    } catch (error) {
      console.error('Error loading tutorial state:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTutorialState = async (tutorialType: keyof TutorialState, action: 'remind_later' | 'never_show') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newState = {
        ...tutorialState,
        [tutorialType]: action,
        // If dismissing email notification tutorial as never_show, record the date
        ...(tutorialType === 'emailNotificationTutorial' && action === 'never_show' && {
          emailNotificationDismissedAt: new Date().toISOString().split('T')[0]
        })
      };

      await supabase
        .from('profiles')
        .update({ tutorial_settings: newState } as any)
        .eq('id', user.id);

      setTutorialState(newState);
    } catch (error) {
      console.error('Error updating tutorial state:', error);
    }
  };

  return {
    tutorialState,
    loading,
    updateTutorialState
  };
}
