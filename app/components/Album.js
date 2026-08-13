"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import PlateHeading from "./ui/PlateHeading";
import { projects } from "../data/portfolio";

/* Leaves = one contents page, then one leaf per project, then the
   closing leaf. Leaf i shows `front` face up and `back` once turned:

     leaf 0  front Contents          back  photo of project 1
     leaf i  front project i details back  photo of project i+1
     leaf N  front project N details back  end page                */
const LEAVES = projects.length + 1;

function useIsSpread() {
  const [isSpread, setIsSpread] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px) and (min-height: 560px)");
    const update = () => setIsSpread(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isSpread;
}

/* ── Page contents ──────────────────────────────────────────── */

function ContentsPage({ onJump }) {
  return (
    <div className="flex h-full flex-col justify-center px-[8%] py-8">
      <p className="edge text-gold">Contents</p>
      <h3 className="display mt-2 text-[clamp(1.25rem,2vw,1.75rem)] text-print">
        Six frames
      </h3>

      <ol className="mt-5 border-t border-edge">
        {projects.map((p, i) => (
          <li key={p.frame}>
            <button
              type="button"
              onClick={() => onJump(i)}
              className="group flex w-full items-baseline gap-3 border-b border-edge py-2.5 text-left"
            >
              <span className="edge shrink-0 text-gold">{p.frame}</span>
              <span className="display truncate text-[clamp(0.95rem,1.3vw,1.15rem)] text-print transition-colors group-hover:text-gold">
                {p.title}
              </span>
              <span className="ml-auto shrink-0 font-mono text-[10px] tracking-[0.14em] text-silver">
                {p.year}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <p className="edge mt-5 leading-relaxed">
        Turn the page, or pick a frame
      </p>
    </div>
  );
}

function PhotoPage({ project }) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={project.src}
        alt=""
        fill
        sizes="(max-width: 900px) 92vw, 45vw"
        className="toned object-cover"
      />
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ground to-transparent px-[10%] pb-5 pt-14">
        <p className="edge text-gold">Frame {project.frame}</p>
        <p className="display mt-1 text-[clamp(1.1rem,1.8vw,1.5rem)] text-print">
          {project.title}
        </p>
      </div>
    </div>
  );
}

/* `centered` only when the page has room to spare. In the single-page
   layout the text can outgrow its panel and scroll, and centring
   overflowing content would put the top of it out of reach. */
function DetailsPage({ project, centered = true }) {
  return (
    <div
      className={`flex h-full flex-col px-[8%] py-6 ${
        centered ? "justify-center" : "justify-start"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <span className="edge text-gold">{project.frame}</span>
        <span className="edge">{project.year}</span>
      </div>

      <h3 className="display mt-3 text-[clamp(1.35rem,2.4vw,2rem)] leading-tight text-print">
        {project.title}
      </h3>
      <p className="mt-2 text-[clamp(0.8rem,1vw,0.95rem)] leading-relaxed text-emulsion">
        {project.blurb}
      </p>
      <p className="mt-3 text-[clamp(0.75rem,0.95vw,0.875rem)] leading-relaxed text-silver">
        {project.body}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((tool) => (
          <li
            key={tool}
            className="border border-edge px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-emulsion"
          >
            {tool}
          </li>
        ))}
      </ul>

      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-5 inline-flex items-center gap-2 self-start border-b border-gold pb-1 text-xs text-print transition-colors hover:text-gold"
      >
        View the source
        <ArrowUpRight
          size={13}
          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}

function EndPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-[10%] text-center">
      <p className="edge text-gold">End of the roll</p>
      <p className="display mt-3 text-[clamp(1.1rem,1.8vw,1.5rem)] leading-snug text-print">
        That&apos;s the whole album.
      </p>
      <a
        href="#colophon"
        className="edge mt-5 border-b border-gold pb-1 text-print transition-colors hover:text-gold"
      >
        Get in touch
      </a>
    </div>
  );
}

function leafFront(i, onJump) {
  return i === 0 ? (
    <ContentsPage onJump={onJump} />
  ) : (
    <DetailsPage project={projects[i - 1]} />
  );
}

function leafBack(i) {
  return i < projects.length ? <PhotoPage project={projects[i]} /> : <EndPage />;
}

/* ── The album ──────────────────────────────────────────────── */

export default function Album() {
  const [turned, setTurned] = useState(0);
  const isSpread = useIsSpread();

  const next = useCallback(
    () => setTurned((t) => Math.min(t + 1, LEAVES)),
    []
  );
  const prev = useCallback(() => setTurned((t) => Math.max(t - 1, 0)), []);
  const jump = useCallback((projectIndex) => setTurned(projectIndex + 1), []);

  function onKey(e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  }

  const atStart = turned === 0;
  const atEnd = turned === LEAVES;
  const currentProject = turned > 0 && turned <= projects.length
    ? projects[turned - 1]
    : null;

  return (
    <>
      <PlateHeading
        number="II"
        title="Exposures"
        note={`${projects.length} frames · turn the page`}
      />

      {/* The bound album. On a spread it opens to two pages; on a
          narrow screen it becomes a single page that flips. */}
      <div
        role="group"
        aria-label="Project album"
        tabIndex={0}
        onKeyDown={onKey}
        className="relative mx-auto w-full max-w-[1080px] rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-gold"
        style={{ perspective: "2200px" }}
      >
        {isSpread ? (
          <div
            className="relative mx-auto w-full"
            style={{ height: "min(560px, 56vh)", transformStyle: "preserve-3d" }}
          >
            {/* Under-pages: what sits beneath the leaves at either end
                of the album. */}
            <div className="gutter-r absolute inset-y-0 left-0 w-1/2 overflow-hidden border border-edge bg-board">
              <div className="flex h-full flex-col items-center justify-center px-[10%] text-center">
                <p className="edge text-gold">Vol. 01</p>
                <p className="display mt-3 text-[clamp(1.1rem,1.8vw,1.5rem)] text-print">
                  Selected work
                </p>
                <p className="edge mt-3 leading-relaxed">
                  Samridhi Parajuli · Toronto
                </p>
              </div>
            </div>

            <div className="gutter-l absolute inset-y-0 right-0 w-1/2 overflow-hidden border border-edge bg-board">
              <EndPage />
            </div>

            {/* The leaves */}
            {Array.from({ length: LEAVES }, (_, i) => {
              const isTurned = i < turned;
              return (
                <div
                  key={i}
                  className="leaf"
                  aria-hidden={
                    i !== turned && i !== turned - 1 ? "true" : undefined
                  }
                  style={{
                    transform: `rotateY(${isTurned ? -180 : 0}deg)`,
                    zIndex: isTurned ? LEAVES + i : LEAVES - i,
                  }}
                >
                  <div className="leaf-face gutter-l border border-edge">
                    {leafFront(i, jump)}
                  </div>
                  <div
                    className="leaf-face gutter-r border border-edge"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    {leafBack(i)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Single-page album for narrow screens */
          <div
            className="relative w-full overflow-hidden border border-edge bg-board"
            style={{ height: "min(520px, 68vh)" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={turned}
                initial={{ rotateY: 35, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -35, opacity: 0 }}
                transition={{ duration: 0.42, ease: [0.36, 0.06, 0.16, 1] }}
                className="h-full origin-left"
              >
                {atStart ? (
                  <ContentsPage onJump={jump} />
                ) : currentProject ? (
                  <div className="flex h-full flex-col">
                    <div className="relative h-[38%] shrink-0">
                      <PhotoPage project={currentProject} />
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto">
                      <DetailsPage project={currentProject} centered={false} />
                    </div>
                  </div>
                ) : (
                  <EndPage />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Turning controls */}
      <div className="mx-auto mt-5 flex w-full max-w-[1080px] items-center justify-between">
        <button
          type="button"
          onClick={prev}
          disabled={atStart}
          className="group flex items-center gap-2 text-silver transition-colors hover:text-gold disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          <span className="edge">Back</span>
        </button>

        <p className="edge" aria-live="polite">
          {atStart
            ? "Contents"
            : atEnd
              ? "End"
              : `Frame ${currentProject.frame} of ${projects.length}`}
        </p>

        <button
          type="button"
          onClick={next}
          disabled={atEnd}
          className="group flex items-center gap-2 text-silver transition-colors hover:text-gold disabled:pointer-events-none disabled:opacity-30"
        >
          <span className="edge">Turn the page</span>
          <ChevronRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </div>
    </>
  );
}
