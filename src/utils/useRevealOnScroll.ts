import { useEffect, useRef } from 'react';

interface RevealOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export function useRevealOnScroll<T extends HTMLElement>(options: RevealOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('reveal-visible');
          observer.unobserve(node);
        }
      },
      {
        rootMargin: options.rootMargin ?? '0px 0px -12% 0px',
        threshold: options.threshold ?? 0.2
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [options.rootMargin, options.threshold]);

  return ref;
}
