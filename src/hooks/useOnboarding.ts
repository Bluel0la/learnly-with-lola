
import { useState, useCallback, useEffect } from "react";

const ONBOARDING_KEY = "learnly_onboarding_complete";

export const useOnboarding = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const isComplete = localStorage.getItem(ONBOARDING_KEY);
    if (!isComplete) setOpen(true);
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setOpen(false);
  }, []);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    setOpen(true);
  }, []);

  return {
    open,
    completeOnboarding,
    resetOnboarding
  };
};
