
import { useEffect, useState } from "react";
import { useTutorialPopovers } from "@/hooks/useTutorialPopovers";
import { HomeScreenTutorial } from "./HomeScreenTutorial";
import { EmailNotificationTutorial } from "./EmailNotificationTutorial";
import { SpamEmailTutorial } from "./SpamEmailTutorial";

export function TutorialManager() {
  const { tutorialState, loading, updateTutorialState } = useTutorialPopovers();
  const [currentTutorial, setCurrentTutorial] = useState<'home' | 'email' | 'spam' | null>(null);

  useEffect(() => {
    if (loading) return;

    // Show tutorials in sequence: home -> email -> spam
    if (tutorialState.homeScreenTutorial === 'show') {
      setCurrentTutorial('home');
    } else if (tutorialState.emailNotificationTutorial === 'show') {
      setCurrentTutorial('email');
    } else if (tutorialState.spamEmailTutorial === 'show') {
      setCurrentTutorial('spam');
    }
  }, [tutorialState, loading]);

  const handleHomeTutorialRemindLater = async () => {
    await updateTutorialState('homeScreenTutorial', 'remind_later');
    setCurrentTutorial(null);
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
    
    // Show spam tutorial if it should be shown
    if (tutorialState.spamEmailTutorial === 'show') {
      setTimeout(() => setCurrentTutorial('spam'), 500);
    }
  };

  const handleSpamTutorialRemindLater = async () => {
    await updateTutorialState('spamEmailTutorial', 'remind_later');
    setCurrentTutorial(null);
  };

  const handleSpamTutorialNeverShow = async () => {
    await updateTutorialState('spamEmailTutorial', 'never_show');
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
      
      <SpamEmailTutorial
        open={currentTutorial === 'spam'}
        onRemindLater={handleSpamTutorialRemindLater}
        onNeverShow={handleSpamTutorialNeverShow}
      />
    </>
  );
}
