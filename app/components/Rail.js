"use client";

import { useEffect, useState } from "react";
import { plates } from "../data/portfolio";

/**
 * The archive index, fixed to the left edge. It doubles as a frame
 * counter: the gold marker tracks which plate you're looking at.
 */
export default function Rail() {
  const [active, setActive] = useState(plates[0].id);

  useEffect(() => {
    const sections = plates
      .map((p) => document.getElementById(p.id))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Archive index"
      className="pointer-events-none fixed left-0 top-0 z-40 hidden h-screen w-[68px] flex-col justify-center border-r border-edge/70 bg-ground/80 backdrop-blur-sm xl:flex"
    >
      <ul className="pointer-events-auto flex flex-col gap-5 py-8">
        {plates.map((plate, i) => {
          const isActive = active === plate.id;
          return (
            <li key={plate.id} className="flex justify-center">
              <a
                href={`#${plate.id}`}
                title={plate.label}
                className="group flex w-full flex-col items-center gap-2 py-1"
              >
                <span
                  className={`font-mono text-[10px] tracking-[0.16em] transition-colors duration-300 ${
                    isActive
                      ? "text-gold"
                      : "text-silver/60 group-hover:text-emulsion"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-px transition-all duration-300 ${
                    isActive
                      ? "w-7 bg-gold"
                      : "w-3 bg-silver/40 group-hover:w-5 group-hover:bg-emulsion"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
