import { useState, useEffect } from 'react';

export const useIsAndroid = () => {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    // Check for Android specifically
    if (/android/i.test(userAgent)) {
      setIsAndroid(true);
    }
    // Alternatively, check for a specific header injected by your Android wrapper WebView
    // e.g. if ((window as any).AndroidInterface) ...
  }, []);

  return isAndroid;
};