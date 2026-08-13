"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowDown } from "lucide-react";
import Develop from "./ui/Develop";
import { profile } from "../data/portfolio";

/** The exposure data printed along a contact sheet's bottom edge.
 *  Here it carries the things you'd actually want to know first. */
const EXPOSURE = [
  profile.location,
  "Full stack · applied AI",
  "Next.js · Python · FastAPI",
  "Open to work",
];

export default function Cover() {
  const frame = useRef(null);
  const reduce = useReducedMotion();

  // Cursor parallax — the print shifts under the light as you move.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 22, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 120, damping: 22, mass: 0.6 });
  const tx = useTransform(sx, [-0.5, 0.5], ["-14px", "14px"]);
  const ty = useTransform(sy, [-0.5, 0.5], ["-10px", "10px"]);
  const rz = useTransform(sx, [-0.5, 0.5], ["1.2deg", "-1.2deg"]);

  function handleMove(e) {
    const el = frame.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={frame}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative flex min-h-screen w-full flex-col justify-between px-6 pb-8 pt-8 sm:px-10 sm:pb-10 xl:pl-[108px]"
    >
      {/* Top edge — the album's spine label */}
      <div
        className="flex items-center justify-between border-b border-edge pb-4"
        style={{ animation: "line-up 900ms cubic-bezier(.22,.7,.3,1) 100ms both" }}
      >
        <span className="edge text-gold">Archive of Work — Vol. 01</span>
        <span className="edge hidden sm:block">
          {profile.location} · Est. 2026
        </span>
      </div>

      {/* The cover spread */}
      <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.9fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <h1 className="display text-cover text-print">
            <span
              className="block"
              style={{
                animation: "line-up 1100ms cubic-bezier(.22,.7,.3,1) 350ms both",
              }}
            >
              {profile.first}
            </span>
            <span
              className="block text-silver"
              style={{
                animation: "line-up 1100ms cubic-bezier(.22,.7,.3,1) 480ms both",
              }}
            >
              {profile.last}
            </span>
          </h1>

          <div
            className="mt-8 max-w-md border-l border-gold/50 pl-5"
            style={{
              animation: "line-up 900ms cubic-bezier(.22,.7,.3,1) 780ms both",
            }}
          >
            <p className="text-lg leading-relaxed text-emulsion">
              A full stack developer in Toronto. I build web applications
              end to end, and I&apos;m putting AI to work inside them.
            </p>
          </div>

          <div
            className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4"
            style={{
              animation: "line-up 900ms cubic-bezier(.22,.7,.3,1) 900ms both",
            }}
          >
            <a
              href="#exposures"
              className="group inline-flex items-center gap-3 border-b border-gold pb-1 text-sm font-medium text-print transition-colors hover:text-gold"
            >
              See the work
              <ArrowDown
                size={15}
                className="transition-transform duration-300 group-hover:translate-y-1"
                aria-hidden="true"
              />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="border-b border-transparent pb-1 text-sm text-silver transition-colors hover:border-emulsion hover:text-emulsion"
            >
              {profile.email}
            </a>
          </div>
        </div>

        {/* The print itself, mounted with crop marks */}
        <motion.div
          style={{ x: tx, y: ty, rotate: rz }}
          className="order-1 mx-auto w-full max-w-[460px] lg:order-2 lg:mr-0"
        >
          <div className="crop-marks p-2">
            <Develop
              src={profile.cover}
              alt=""
              priority
              duration={1900}
              delay={250}
              sizes="(max-width: 1024px) 92vw, 460px"
              className="aspect-[4/5] w-full shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] lg:aspect-auto lg:h-[calc(100vh-320px)] lg:min-h-[320px] lg:max-h-[520px]"
            />
            <div className="mt-3 flex items-baseline justify-between">
              <span className="edge">Frame 00 — the photographer</span>
              <span className="edge text-gold">↑</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom edge — exposure data, scrolling like film-edge printing */}
      <div className="overflow-hidden border-t border-edge pt-4">
        <div
          className="flex w-max gap-10 whitespace-nowrap"
          style={{ animation: "edge-scroll 38s linear infinite" }}
        >
          {[0, 1, 2, 3].map((copy) => (
            <div key={copy} className="flex gap-10" aria-hidden={copy !== 0}>
              {EXPOSURE.map((item) => (
                <span key={item} className="edge flex items-center gap-10">
                  {item}
                  <span className="text-gold/70">◦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
