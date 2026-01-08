import { useEffect, useState } from 'react';

export const useIsPWA = () => {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone;

    setIsPWA(!!standalone);
  }, []);

  return isPWA;
};
