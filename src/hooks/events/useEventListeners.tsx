
import { useEffect } from "react";

/**
 * Hook to set up event data refresh listeners
 */
export function useEventListeners(loadParticipations: () => Promise<any>, refreshEvents: () => Promise<void>) {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Window visible, refreshing participations and events");
        loadParticipations();
        refreshEvents();
      }
    };
    
    const handleFocus = () => {
      console.log("Window focused, refreshing participations and events");
      loadParticipations();
      refreshEvents();
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadParticipations, refreshEvents]);

  useEffect(() => {
    // Set up a route change listener to refresh data when returning to this page
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/events') {
        console.log('Back on events page, refreshing data');
        loadParticipations();
        refreshEvents();
      }
    };

    // Add event listener for 'popstate' to detect navigation with browser back/forward buttons
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [loadParticipations, refreshEvents]);

  return null; // This hook doesn't return anything, it just sets up listeners
}
