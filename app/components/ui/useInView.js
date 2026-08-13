"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fires once when an element first enters the viewport, then stops
 * observing. Prints develop exactly once — a photograph doesn't
 * un-develop when you scroll back past it.
 */
export function useInView({ threshold = 0.2, rootMargin = "0px 0px -10% 0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Without IntersectionObserver there is nothing to trigger the
    // reveal, so show the content rather than leaving it invisible.
    // This runs once on mount as a capability fallback, not as state
    // derived from a render.
    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
}
