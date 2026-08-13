"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { profile } from "../data/portfolio";

const lerp = (a, b, t) => a + (b - a) * t;

/* Slow at both ends, quick through the middle — the print holds its
   pose on the cover, travels, then settles as a backdrop. */
const easeInOut = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* The window the print is seen through, as clip-path insets.
   On the cover it's a portrait frame held to the right; by the time
   the second plate arrives it has opened to the full viewport. */
const FRAME = { top: 16, right: 8, bottom: 16, left: 56, radius: 14 };

/**
 * One photograph shared between the first two plates.
 *
 * It can't live inside either section — each plate carries its own 3D
 * transform, which would trap a child in that plate's coordinate
 * space. So it sits in a fixed layer beneath both, and scroll drives
 * it: the frame opens outward from the cover print to full bleed, the
 * image eases back to true scale, and a scrim comes up so the second
 * plate's text can be read over it. It clears out again before the
 * album arrives.
 *
 * While it's active it sets `data-shared="on"` on <html>, which hides
 * the two inline prints it stands in for. Doing that in CSS rather
 * than by swapping React trees keeps the server and client markup
 * identical.
 */
export default function SharedPrint() {
  const [vh, setVh] = useState(0);
  const [active, setActive] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const sync = () => {
      const on =
        mq.matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      setActive(on);
      setVh(window.innerHeight);

      const root = document.documentElement;
      if (on) root.setAttribute("data-shared", "on");
      else root.removeAttribute("data-shared");
    };

    sync();
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);

    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      document.documentElement.removeAttribute("data-shared");
    };
  }, [reduce]);

  const H = vh || 1;

  // 0 on the cover, 1 once the second plate has fully arrived.
  const travel = useTransform(scrollY, [0, H], [0, 1], { clamp: true });
  const eased = useSpring(travel, {
    stiffness: 140,
    damping: 30,
    mass: 0.5,
  });

  const clipPath = useTransform(eased, (v) => {
    const t = easeInOut(Math.min(1, Math.max(0, v)));
    // The corners round off while it's a print on the cover and go
    // square as it opens — a full-bleed backdrop with rounded corners
    // would read as a card floating on the page.
    const radius = lerp(FRAME.radius, 0, t);
    return `inset(${lerp(FRAME.top, 0, t)}% ${lerp(FRAME.right, 0, t)}% ${lerp(
      FRAME.bottom,
      0,
      t
    )}% ${lerp(FRAME.left, 0, t)}% round ${radius}px)`;
  });

  // Eases back to true scale as it opens, then drifts on as it leaves.
  const scale = useTransform(scrollY, [0, H, 2 * H], [1.16, 1, 1.1], {
    clamp: true,
  });

  // The scrim only arrives once the frame is most of the way open, so
  // the cover print stays bright while it is still the subject.
  const dim = useTransform(scrollY, [0.5 * H, H], [0, 1], { clamp: true });

  // Clear the stage before the album plate scrolls in behind it.
  const opacity = useTransform(
    scrollY,
    [0, 0.02 * H, 1.4 * H, 1.85 * H],
    [1, 1, 1, 0],
    { clamp: true }
  );

  if (!active) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 hidden lg:block"
      style={{ opacity }}
    >
      <motion.div className="absolute inset-0 grain" style={{ clipPath }}>
        <motion.div className="absolute inset-0" style={{ scale }}>
          <Image
            src={profile.cover}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              animation:
                "develop 1900ms cubic-bezier(0.22, 0.7, 0.3, 1) 250ms both",
            }}
          />
        </motion.div>

        {/* The scrim that turns a photograph into a backdrop. It is
            weighted to the left, where the writing sits: that side
            drops far enough back to read against, while the right
            keeps enough of the photograph to still be one. */}
        <motion.div className="absolute inset-0" style={{ opacity: dim }}>
          <div className="absolute inset-0 bg-ground/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-ground/85 via-ground/55 to-ground/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-ground/70 to-transparent" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
