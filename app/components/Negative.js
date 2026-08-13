"use client";

import { useRef, useState } from "react";
import {
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  motion,
} from "motion/react";
import PlateHeading from "./ui/PlateHeading";
import { skills } from "../data/portfolio";

/** Keeps a value inside [min, max), wrapping around the ends. */
function wrap(min, max, value) {
  const range = max - min;
  return (((value - min) % range) + range) % range + min;
}

/**
 * One roll of 35mm stock. The strip is always creeping past at its
 * own pace, but scrolling drags it: the film speeds up in the
 * direction you scroll, skews under the load, and coasts back to its
 * resting speed when you stop. Hovering holds it still to be read.
 */
function Strip({ roll, index }) {
  const [held, setHeld] = useState(false);

  // This strip moves on its own via requestAnimationFrame, so the
  // reduced-motion rule in the stylesheet can't reach it. Unattended
  // motion is the kind this setting most wants stopped, so hold the
  // film still and let it be read as a static list.
  const reduce = useReducedMotion();

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 48,
    stiffness: 360,
  });

  const velocityFactor = useTransform(
    smoothVelocity,
    [-2200, 0, 2200],
    [-3.5, 0, 3.5],
    { clamp: false }
  );

  const skew = useTransform(smoothVelocity, [-2200, 0, 2200], [3, 0, -3], {
    clamp: true,
  });

  const direction = index % 2 === 0 ? -1 : 1;
  const baseSpeed = 1.6 + index * 0.35;

  // Four copies make up the track, so one copy is 25% of its width.
  // Panning by exactly that much loops seamlessly.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (held || reduce) return;
    let move = direction * baseSpeed * (delta / 1000);
    move += move * velocityFactor.get();
    baseX.set(baseX.get() + move);
  });

  return (
    <div
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
    >
      <div className="mb-1.5 flex items-baseline justify-between px-1">
        <span className="edge text-gold">{roll.roll}</span>
        <span className="edge">{roll.stock}</span>
      </div>

      <div className="overflow-hidden border-y border-edge bg-board">
        <div className="sprockets h-3 opacity-70" aria-hidden="true" />

        <motion.div
          className="flex w-max"
          style={{ x, skewX: reduce ? 0 : skew }}
        >
          {[0, 1, 2, 3].map((copy) => (
            <ul key={copy} className="flex" aria-hidden={copy !== 0}>
              {roll.items.map((item) => (
                <li
                  key={item}
                  className="border-r border-edge px-6 py-3.5 text-center"
                >
                  <span className="display whitespace-nowrap text-[clamp(0.95rem,1.4vw,1.25rem)] text-emulsion transition-colors duration-300 hover:text-gold">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </motion.div>

        <div className="sprockets h-3 opacity-70" aria-hidden="true" />
      </div>
    </div>
  );
}

export default function Negative() {
  return (
    <div className="w-full py-[clamp(1.5rem,5vh,4rem)]">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 xl:pl-[108px]">
        <PlateHeading
          number="III"
          title="The Negative"
          note="Scroll to pull the film · hover to hold it"
        />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-[clamp(0.5rem,1.7vh,1.25rem)] px-6 sm:px-10 xl:pl-[108px]">
        {skills.map((roll, i) => (
          <Strip key={roll.roll} roll={roll} index={i} />
        ))}
      </div>
    </div>
  );
}
