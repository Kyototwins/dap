
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TutorialState {
  homeScreenTutorial: 'show' | 'remind_later' | 'never_show';
  instagramFollowTutorial: 'show' | 'remind_later' | 'never_show';
}

export function useTutorialPopovers() {
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    homeScreenTutorial: 'show',
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
        
        // Convert remind_later back to show on new login
        const updatedSettings = {
          homeScreenTutorial: currentSettings.homeScreenTutorial === 'remind_later' ? 'show' : currentSettings.homeScreenTutorial,
          instagramFollowTutorial: currentSettings.instagramFollowTutorial === 'remind_later' ? 'show' : currentSettings.instagramFollowTutorial || 'show'
        };

        // Update database if there were any remind_later statuses
        const shouldUpdate = currentSettings.homeScreenTutorial === 'remind_later' || 
            currentSettings.instagramFollowTutorial === 'remind_later';

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
        [tutorialType]: action
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
