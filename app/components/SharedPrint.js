"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
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
  // Where the album's front cover sits, as clip insets, measured
  // rather than guessed — the album is centred in a max-width column
  // whose position depends on the viewport.
  const [album, setAlbum] = useState(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const measureAlbum = () => {
      const coverEl = document.getElementById("album-cover");
      const section = document.getElementById("exposures");
      if (!coverEl || !section) return setAlbum(null);

      /* Measured from layout, not from getBoundingClientRect. While
         this plate is off-screen it is rotated and pushed back in 3D,
         which would distort a rendered rect; offsetLeft/offsetTop and
         offsetWidth/offsetHeight ignore transforms and give the
         position the cover will hold once the plate is square on. */
      let x = 0;
      let y = 0;
      for (let n = coverEl; n && n !== section; n = n.offsetParent) {
        x += n.offsetLeft;
        y += n.offsetTop;
      }

      // The album itself slides sideways while it's shut, and that
      // shift is a transform, so it has to be added back in.
      const book = coverEl.closest("[data-book]");
      if (book) {
        const t = getComputedStyle(book).transform;
        if (t && t !== "none") {
          x += new DOMMatrixReadOnly(t).m41;
        }
      }

      const w = window.innerWidth;
      const h = window.innerHeight;

      // The section fills the viewport once snapped, so offsets inside
      // it are the cover's eventual position on screen.
      setAlbum({
        top: (y / h) * 100,
        left: (x / w) * 100,
        right: ((w - (x + coverEl.offsetWidth)) / w) * 100,
        bottom: ((h - (y + coverEl.offsetHeight)) / h) * 100,
      });
    };

    const sync = () => {
      const on =
        mq.matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      setActive(on);
      setVh(window.innerHeight);

      const root = document.documentElement;
      if (on) root.setAttribute("data-shared", "on");
      else root.removeAttribute("data-shared");

      // Measure after the attribute lands, so the album is laid out
      // the way it will actually be when the print arrives.
      requestAnimationFrame(measureAlbum);
    };

    sync();
    // Re-measure once webfonts have settled the album's layout.
    const settle = setTimeout(measureAlbum, 900);
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);

    return () => {
      clearTimeout(settle);
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      document.documentElement.removeAttribute("data-shared");
      document.documentElement.removeAttribute("data-gathered");
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

  /* Two journeys in one path. Up to the second plate the frame opens
     from the cover print to full bleed; after it, the same frame
     closes again onto the album's front cover, so the photograph you
     started with is the one bound into the book. */
  const gather = useTransform(scrollY, [H, 2 * H], [0, 1], { clamp: true });

  /* Spring-smoothed for the same reason the opening is: snapping
     covers the distance between two plates in about two frames, so
     tying the shape straight to scroll position would make the print
     jump into the cover rather than gather into it. The spring
     stretches that into something the eye can follow, and lets the
     print arrive just as the plate finishes settling. */
  const closing = useSpring(gather, {
    stiffness: 110,
    damping: 26,
    mass: 0.55,
    restDelta: 0.001,
  });

  const clipPath = useTransform([eased, closing], ([open, close]) => {
    const t = easeInOut(Math.min(1, Math.max(0, open)));

    let top = lerp(FRAME.top, 0, t);
    let right = lerp(FRAME.right, 0, t);
    let bottom = lerp(FRAME.bottom, 0, t);
    let left = lerp(FRAME.left, 0, t);
    let radius = lerp(FRAME.radius, 0, t);

    if (album && close > 0) {
      const c = easeInOut(Math.min(1, Math.max(0, close)));
      top = lerp(top, album.top, c);
      right = lerp(right, album.right, c);
      bottom = lerp(bottom, album.bottom, c);
      left = lerp(left, album.left, c);
      radius = lerp(radius, FRAME.radius, c);
    }

    // The corners round off while it's a print and go square at full
    // bleed — a backdrop with rounded corners would read as a card.
    return `inset(${top}% ${right}% ${bottom}% ${left}% round ${radius}px)`;
  });

  // Eases back to true scale as it opens, then drifts on as it leaves.
  const scale = useTransform(scrollY, [0, H, 2 * H], [1.16, 1, 1.1], {
    clamp: true,
  });

  // The scrim only arrives once the frame is most of the way open, so
  // the cover print stays bright while it is still the subject.
  const scrim = useTransform(scrollY, [0.5 * H, H], [0, 1], { clamp: true });

  // It lifts again as the print gathers into the album — following the
  // same spring, so the brightening and the shrinking move together.
  const dim = useTransform(
    [scrim, closing],
    ([s, c]) => s * (1 - 0.82 * c)
  );

  /* Hand over to the album's own cover, which carries the same
     photograph. Tied to the gather rather than to scroll position:
     the print holds until it has finished closing onto the cover —
     by which point the album is drawn over it anyway — and only then
     goes. Fading on scroll instead would leave it stranded at full
     strength if the album were opened while parked on this plate. */
  const opacity = useTransform(closing, [0.85, 0.97], [1, 0], {
    clamp: true,
  });

  /* Tell the album when the print has arrived, so its cover can take
     up the photograph. The two thresholds are apart on purpose: the
     cover lights up a little before the print goes, so the pair
     overlap for a moment instead of leaving a gap. Scrolling back the
     other way hands the picture to the print again. */
  /* Beneath the plates while it is their backdrop, above them once it
     starts gathering — so it lands on top of the album's cover rather
     than sliding behind it. */
  const zIndex = useTransform(closing, (v) => (v > 0.02 ? 20 : 0));

  const landed = useRef(false);

  useMotionValueEvent(closing, "change", (v) => {
    if (!active) return;

    if (v >= 0.9 && !landed.current) {
      landed.current = true;
      document.documentElement.setAttribute("data-gathered", "on");
    } else if (v < 0.8 && landed.current) {
      landed.current = false;
      document.documentElement.removeAttribute("data-gathered");
    }
  });

  if (!active) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 hidden lg:block"
      style={{ opacity, zIndex }}
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
