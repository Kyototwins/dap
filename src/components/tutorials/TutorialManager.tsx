
import { useEffect, useState } from "react";
import { useTutorialPopovers } from "@/hooks/useTutorialPopovers";
import { InstagramFollowTutorial } from "./InstagramFollowTutorial";

export function TutorialManager() {
  const { tutorialState, loading, updateTutorialState } = useTutorialPopovers();
  const [currentTutorial, setCurrentTutorial] = useState<'instagram' | null>(null);

  useEffect(() => {
    if (loading) return;

    // Only show Instagram tutorial
    if (tutorialState.instagramFollowTutorial === 'show') {
      setCurrentTutorial('instagram');
    }
  }, [tutorialState, loading]);

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
      <InstagramFollowTutorial
        open={currentTutorial === 'instagram'}
        onRemindLater={handleInstagramTutorialRemindLater}
        onNeverShow={handleInstagramTutorialNeverShow}
      />
    </>
  );
}
