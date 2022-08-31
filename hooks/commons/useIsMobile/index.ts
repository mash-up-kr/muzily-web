import { useEffect, useState } from "react";

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const matches = navigator.userAgent.match(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      );

      setIsMobile(matches !== null);
    });
    observer.observe(document.documentElement);

    return () => {
      observer.unobserve(document.documentElement);
    };
  }, []);

  return isMobile;
}
