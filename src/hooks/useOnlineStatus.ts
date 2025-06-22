
import { useEffect, useState } from "react";

/**
 * React hook to track online/offline status.
 * Returns true if online, false otherwise.
 */
export default function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const setOnlineTrue = () => setOnline(true);
    const setOnlineFalse = () => setOnline(false);

    window.addEventListener('online', setOnlineTrue);
    window.addEventListener('offline', setOnlineFalse);

    return () => {
      window.removeEventListener('online', setOnlineTrue);
      window.removeEventListener('offline', setOnlineFalse);
    };
  }, []);

  return online;
}
