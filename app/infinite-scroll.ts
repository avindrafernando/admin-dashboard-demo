import { useEffect, useRef } from 'react';

export function useInfiniteScroll(onIntersect: () => void) {
  const sentinelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        rootMargin: '50px 0px 0px 0px'
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [onIntersect]);

  return sentinelRef;
}
