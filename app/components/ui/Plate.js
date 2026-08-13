"use client";

import { useRef, useSyncExternalStore } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/* Whether we're past server rendering. The value never changes after
   the first client render, so there is nothing to subscribe to. */
const subscribeNever = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * One plate of the album, and one snap position.
 *
 * As a plate travels through the viewport it rotates about its own
 * horizontal axis and falls away from the viewer, so moving between
 * sections reads as turning a face of a solid rather than sliding a
 * flat page. Perspective lives on the section itself — putting it on
 * a shared ancestor would distort plates further down the page.
 */
export default function Plate({ id, children, className = "", flat = false }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  // The server can't know whether this visitor asks for reduced
  // motion, so it renders the plain version and the turn is switched
  // on once we're on the client. Reading it during render instead
  // would make the server and client disagree about the markup.
  const mounted = useSyncExternalStore(subscribeNever, onClient, onServer);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smooth the raw progress so the turn keeps moving for a beat after
  // the scroll stops, instead of snapping to a halt.
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });

  const rotateX = useTransform(progress, [0, 0.5, 1], [14, 0, -14]);
  const z = useTransform(progress, [0, 0.5, 1], [-260, 0, -260]);
  const opacity = useTransform(progress, [0, 0.28, 0.72, 1], [0.25, 1, 1, 0.25]);

  const animated = mounted && !reduce && !flat;

  return (
    <section
      id={id}
      ref={ref}
      className={`relative min-h-screen snap-start ${className}`}
      style={animated ? { perspective: "1400px" } : undefined}
    >
      <motion.div
        className="flex min-h-screen flex-col justify-center"
        style={
          animated
            ? { rotateX, z, opacity, transformStyle: "preserve-3d" }
            : undefined
        }
      >
        {children}
      </motion.div>
    </section>
  );
}
