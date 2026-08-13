"use client";

import Reveal from "./ui/Reveal";
import { useInView } from "./ui/useInView";
import { certifications } from "../data/portfolio";

const TILTS = ["-2.2deg", "1.6deg", "-1.1deg", "2.4deg", "-1.8deg", "1.2deg"];

/** A cachet stamp pressed into the page. */
function Stamp({ item, index }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const tilt = TILTS[index % TILTS.length];

  return (
    <li
      ref={ref}
      style={{
        "--tilt": tilt,
        ...(inView
          ? {
              animation: `stamp-press 620ms cubic-bezier(.3,1.5,.5,1) ${
                index * 130
              }ms both`,
            }
          : { opacity: 0 }),
      }}
      className="relative h-full"
    >
      <div className="h-full border-2 border-stamp/80 p-1">
        <div className="flex h-full flex-col items-center justify-center border border-stamp/60 px-5 py-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-stamp/80">
            Certified
          </p>
          <p className="display mt-3 text-lg leading-tight text-stamp">
            {item.title}
          </p>
          <p className="mt-auto pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-stamp/80">
            {item.issuer} · {item.year}
          </p>
        </div>
      </div>
    </li>
  );
}

export default function Stamps() {
  return (
    <div className="w-full px-6 py-[clamp(1.5rem,5vh,4rem)] sm:px-10 xl:pl-[108px]">
      <div className="mx-auto max-w-6xl">
        {/* The one page in the album turned to the light. Stamps are
            ink on paper, so here the paper actually appears. */}
        <Reveal>
          <div className="grain bg-print px-6 py-10 shadow-[0_40px_100px_-40px_rgba(0,0,0,1)] sm:px-12 sm:py-14">
            <header className="mb-9 border-b border-ground/15 pb-4 sm:mb-12">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stamp">
                  Plate V
                </span>
                <span
                  className="h-px flex-1 bg-ground/15"
                  aria-hidden="true"
                />
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ground/50 sm:block">
                  {certifications.length} on file
                </span>
              </div>
              <h2 className="display mt-4 text-plate text-ground">Stamps</h2>
            </header>

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {certifications.map((item, i) => (
                <Stamp key={item.title} item={item} index={i} />
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
