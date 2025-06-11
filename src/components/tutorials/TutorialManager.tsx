
import { useEffect, useState } from "react";
import { useTutorialPopovers } from "@/hooks/useTutorialPopovers";
import { HomeScreenTutorial } from "./HomeScreenTutorial";
import { EmailNotificationTutorial } from "./EmailNotificationTutorial";
import { InstagramFollowTutorial } from "./InstagramFollowTutorial";

export function TutorialManager() {
  const { tutorialState, loading, updateTutorialState } = useTutorialPopovers();
  const [currentTutorial, setCurrentTutorial] = useState<'home' | 'email' | 'instagram' | null>(null);

  useEffect(() => {
    if (loading) return;

    // Show home screen tutorial first if it's set to 'show' only
    if (tutorialState.homeScreenTutorial === 'show') {
      setCurrentTutorial('home');
    } else if (tutorialState.emailNotificationTutorial === 'show') {
      setCurrentTutorial('email');
    } else if (tutorialState.instagramFollowTutorial === 'show') {
      setCurrentTutorial('instagram');
    }
  }, [tutorialState, loading]);

  const handleHomeTutorialRemindLater = async () => {
    await updateTutorialState('homeScreenTutorial', 'remind_later');
    setCurrentTutorial(null);
    // Don't show next tutorial immediately
  };

  const handleHomeTutorialNeverShow = async () => {
    await updateTutorialState('homeScreenTutorial', 'never_show');
    setCurrentTutorial(null);
    
    // Show email tutorial if it should be shown
    if (tutorialState.emailNotificationTutorial === 'show') {
      setTimeout(() => setCurrentTutorial('email'), 500);
    }
  };

  const handleEmailTutorialRemindLater = async () => {
    await updateTutorialState('emailNotificationTutorial', 'remind_later');
    setCurrentTutorial(null);
  };

  const handleEmailTutorialNeverShow = async () => {
    await updateTutorialState('emailNotificationTutorial', 'never_show');
    setCurrentTutorial(null);
    
    // Show Instagram tutorial if it should be shown
    if (tutorialState.instagramFollowTutorial === 'show') {
      setTimeout(() => setCurrentTutorial('instagram'), 500);
    }
  };

  const handleInstagramTutorialRemindLater = async () => {
    await updateTutorialState('instagramFollowTutorial', 'remind_later');
    setCurrentTutorial(null);
  };

  const handleInstagramTutorialNeverShow = async () => {
    await updateTutorialState('instagramFollowTutorial', 'never_show');
    setCurrentTutorial(null);
  };

  if (loading) return null;

  return (
    <>
      <HomeScreenTutorial
        open={currentTutorial === 'home'}
        onRemindLater={handleHomeTutorialRemindLater}
        onNeverShow={handleHomeTutorialNeverShow}
      />
      
      <EmailNotificationTutorial
        open={currentTutorial === 'email'}
        onRemindLater={handleEmailTutorialRemindLater}
        onNeverShow={handleEmailTutorialNeverShow}
      />
      
      <InstagramFollowTutorial
        open={currentTutorial === 'instagram'}
        onRemindLater={handleInstagramTutorialRemindLater}
        onNeverShow={handleInstagramTutorialNeverShow}
      />
    </>
  );
}
