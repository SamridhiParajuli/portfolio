"use client";

import { useInView } from "./useInView";

/** Text and blocks rise a little as they come in. Quiet, so the
 *  develop transition on the photographs stays the loud thing. */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}) {
  const [ref, inView] = useInView({ threshold: 0.15 });

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 800ms cubic-bezier(0.22,0.7,0.3,1) ${delay}ms, transform 800ms cubic-bezier(0.22,0.7,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
