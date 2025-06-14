
import { useState, useEffect } from 'react';

export const useOnboarding = () => {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('bemor_onboarding_completed');
    if (!hasCompletedOnboarding) {
      setIsFirstTime(true);
      setShowTour(true);
    }
  }, []);

  const completeTour = () => {
    localStorage.setItem('bemor_onboarding_completed', 'true');
    setShowTour(false);
    setIsFirstTime(false);
  };

  const skipTour = () => {
    localStorage.setItem('bemor_onboarding_completed', 'true');
    setShowTour(false);
    setIsFirstTime(false);
  };

  const restartTour = () => {
    localStorage.removeItem('bemor_onboarding_completed');
    setShowTour(true);
    setIsFirstTime(true);
  };

  return {
    isFirstTime,
    showTour,
    completeTour,
    skipTour,
    restartTour
  };
};
