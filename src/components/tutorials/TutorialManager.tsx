
import { useEffect, useState } from "react";
import { useTutorialPopovers } from "@/hooks/useTutorialPopovers";
import { InstagramFollowTutorial } from "./InstagramFollowTutorial";
import { EmailNotificationTutorial } from "./EmailNotificationTutorial";

export function TutorialManager() {
  const { tutorialState, loading, updateTutorialState } = useTutorialPopovers();
  const [currentTutorial, setCurrentTutorial] = useState<'instagram' | 'email' | null>(null);

  useEffect(() => {
    if (loading) return;

    // Show tutorials in order: Instagram first, then Email
    if (tutorialState.instagramFollowTutorial === 'show') {
      setCurrentTutorial('instagram');
    } else if (tutorialState.emailNotificationTutorial === 'show') {
      setCurrentTutorial('email');
    }
  }, [tutorialState, loading]);

  const handleInstagramTutorialRemindLater = async () => {
    await updateTutorialState('instagramFollowTutorial', 'remind_later');
    // Always show email tutorial after Instagram tutorial is dismissed
    setCurrentTutorial('email');
  };

  const handleInstagramTutorialNeverShow = async () => {
    await updateTutorialState('instagramFollowTutorial', 'never_show');
    // Always show email tutorial after Instagram tutorial is dismissed
    setCurrentTutorial('email');
  };

  const handleEmailTutorialRemindLater = async () => {
    await updateTutorialState('emailNotificationTutorial', 'remind_later');
    setCurrentTutorial(null);
  };

  const handleEmailTutorialNeverShow = async () => {
    await updateTutorialState('emailNotificationTutorial', 'never_show');
    setCurrentTutorial(null);
  };

  if (loading) return null;

  return (
    <>
      <InstagramFollowTutorial
        open={currentTutorial === 'instagram'}
        onRemindLater={handleInstagramTutorialRemindLater}
        onNeverShow={handleInstagramTutorialNeverShow}
      />
      <EmailNotificationTutorial
        open={currentTutorial === 'email'}
        onRemindLater={handleEmailTutorialRemindLater}
        onNeverShow={handleEmailTutorialNeverShow}
      />
    </>
  );
}
