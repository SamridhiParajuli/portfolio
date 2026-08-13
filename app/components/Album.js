"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import PlateHeading from "./ui/PlateHeading";
import { profile, projects } from "../data/portfolio";

/* The album is bound like a real one: a front cover, a contents leaf,
   one leaf per project, and a closing leaf. Leaf i shows `front` face
   up and `back` once it has been turned over:

     leaf 0        front cover           inside front cover
     leaf 1        contents              photo of project 1
     leaf 2..N-1   project details       photo of the next project
     leaf N        last project details  end page                    */
const LEAVES = projects.length + 2;

/* Where a project sits in the leaf order, and back again. */
const leafForProject = (i) => i + 2;
const projectForLeaf = (t) =>
  t >= 2 && t <= projects.length + 1 ? projects[t - 2] : null;

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

function FrontCover() {
  return (
    // `album-cover` is the target the shared print gathers onto as the
    // second plate hands over to this one.
    <div id="album-cover" className="relative h-full w-full">
      {/* Everything photographic sits in one layer so it can be held
          back as a whole until the travelling print has landed. */}
      <div className="album-photo absolute inset-0">
        <Image
          src={profile.cover}
          alt=""
          fill
          sizes="(max-width: 900px) 92vw, 45vw"
          className="toned object-cover"
        />

        {/* Weighted to the foot of the cover, where the title sits, so
            the photograph keeps its light at the head. */}
        <div className="absolute inset-0 bg-ground/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ground via-ground/55 to-transparent" />
        {/* The head of this photograph is a bright window; the eyebrow
            needs something to sit on. */}
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-ground/75 to-transparent" />
        <div className="grain pointer-events-none absolute inset-0" />
      </div>

      {/* The rule struck into the board */}
      <div className="absolute inset-4 border border-gold/45" />

      <div className="relative flex h-full flex-col justify-between p-8 lg:p-10">
        <div className="flex items-baseline justify-between">
          <span className="edge text-gold">Archive of Work</span>
          <span className="edge text-emulsion">Vol. 01</span>
        </div>

        <div>
          <h3 className="display text-[clamp(1.75rem,3.2vw,2.9rem)] leading-[0.92] text-print">
            Selected
            <br />
            Work
          </h3>
          <p className="edge mt-5 border-t border-print/25 pt-3 text-emulsion">
            {profile.name} · {projects.length} frames
          </p>
        </div>
      </div>
    </div>
  );
}

function InsideCover() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-[12%] text-center">
      <p className="edge text-gold">Vol. 01</p>
      <p className="display mt-3 text-[clamp(1.1rem,1.8vw,1.5rem)] leading-snug text-print">
        Six things I built, and what each one was actually hard about.
      </p>
      <p className="edge mt-4 leading-relaxed">
        {profile.location} · 2023 — 2026
      </p>
    </div>
  );
}

function ContentsPage({ onJump }) {
  return (
    <div className="flex h-full flex-col justify-center px-[8%] py-6">
      <p className="edge text-gold">Contents</p>
      <h3 className="display mt-1 text-[clamp(1.15rem,1.9vw,1.6rem)] text-print">
        Six frames
      </h3>

      <ol className="mt-4 border-t border-edge">
        {projects.map((p, i) => (
          <li key={p.frame}>
            <button
              type="button"
              onClick={() => onJump(i)}
              className="group flex w-full items-baseline gap-3 border-b border-edge py-2 text-left"
            >
              <span className="edge shrink-0 text-gold">{p.frame}</span>
              <span className="display truncate text-[clamp(0.9rem,1.25vw,1.1rem)] text-print transition-colors group-hover:text-gold">
                {p.title}
              </span>
              <span className="ml-auto shrink-0 font-mono text-[10px] tracking-[0.14em] text-silver">
                {p.year}
              </span>
            </button>
          </li>
        ))}
      </ol>
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
  if (i === 0) return <FrontCover />;
  if (i === 1) return <ContentsPage onJump={onJump} />;
  return <DetailsPage project={projects[i - 2]} />;
}

function leafBack(i) {
  if (i === 0) return <InsideCover />;
  if (i <= projects.length) return <PhotoPage project={projects[i - 1]} />;
  return <EndPage />;
}

/* ── One leaf ───────────────────────────────────────────────── */

/**
 * A single sheet, hinged at the spine. Its angle is a motion value so
 * that a drag can hold it part-way open, and the shading on both faces
 * is derived from that same angle — paper turning away from the light
 * gets darker as it goes edge-on, which is what sells it as a sheet
 * with two sides rather than a flipping rectangle.
 */
function Leaf({ nodeRef, isTurned, zIndex, front, back, showPeel, isTop }) {
  return (
    <div
      ref={nodeRef}
      className="leaf group/leaf"
      style={{
        zIndex,
        transform: `rotateY(${isTurned ? -180 : 0}deg)`,
        // Only the sheet on top casts onto the board; shadowing every
        // leaf in the stack just muddies the edges.
        boxShadow: isTop ? "0 30px 80px -28px rgba(0,0,0,0.95)" : "none",
      }}
      aria-hidden={showPeel ? undefined : "true"}
    >
      {/* Front face */}
      <div className="leaf-face gutter-l border border-edge">
        {front}

        <span
          data-shade="front"
          className="leaf-shade"
          style={{ opacity: isTurned ? 0.5 : 0 }}
          aria-hidden="true"
        />
        <span data-cast className="leaf-cast" aria-hidden="true" />

        {showPeel && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 z-[2] h-11 w-11 transition-all duration-500 ease-out group-hover/leaf:h-20 group-hover/leaf:w-20"
            style={{
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              background:
                "linear-gradient(315deg, var(--color-edge) 0%, var(--color-board) 55%, var(--color-gold) 130%)",
              boxShadow: "-8px -8px 20px rgba(0,0,0,0.55)",
            }}
          />
        )}
      </div>

      {/* Back face */}
      <div
        className="leaf-face gutter-r border border-edge"
        style={{ transform: "rotateY(180deg)" }}
      >
        {back}
        <span
          data-shade="back"
          className="leaf-shade"
          style={{ opacity: isTurned ? 0 : 0.6 }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/* ── The album ──────────────────────────────────────────────── */

export default function Album() {
  const [turned, setTurned] = useState(0);
  const [draggingLeaf, setDraggingLeaf] = useState(null);
  const [hasTurned, setHasTurned] = useState(false);
  const isSpread = useIsSpread();
  const reduce = useReducedMotion();

  const bookRef = useRef(null);
  const dragRef = useRef(null);

  /* Leaves are ordinary elements whose rotation comes from React state
     and eases via the CSS transition on `.leaf`. A drag needs finer
     control than that, so while a sheet is held it is written to
     directly and its transition is switched off; letting go hands it
     back to the stylesheet. */
  const leafNodes = useRef([]);

  const closed = turned === 0;
  /* Shut and untouched, the album sits centred. The moment a page is
     taken hold of it moves into spread position, so the sheet has a
     left-hand page to swing onto instead of over the edge. */
  const shut = closed && draggingLeaf === null;
  const atEnd = turned === LEAVES;
  const currentProject = projectForLeaf(turned);

  const go = useCallback((next) => {
    setTurned(next);
    setHasTurned(true);
  }, []);

  const next = useCallback(
    () => go(Math.min(turned + 1, LEAVES)),
    [go, turned]
  );
  const prev = useCallback(() => go(Math.max(turned - 1, 0)), [go, turned]);
  const jump = useCallback((i) => go(leafForProject(i)), [go]);

  function onKeyDown(e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  }

  /* ── Dragging a page over ──────────────────────────────────
     Grab the right half to turn forward, the left half to turn back.
     The leaf tracks the pointer the whole way; letting go past a third
     of the way completes the turn, otherwise it falls back. */

  function onPointerDown(e) {
    if (!isSpread || e.button !== 0) return;

    const el = bookRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const forward = e.clientX - rect.left > rect.width / 2;
    const leaf = forward ? turned : turned - 1;

    if (leaf < 0 || leaf >= LEAVES) return;

    const node = leafNodes.current[leaf];
    if (!node) return;

    dragRef.current = {
      leaf,
      forward,
      startX: e.clientX,
      half: rect.width / 2,
      progress: 0,
      node,
      front: node.querySelector('[data-shade="front"]'),
      back: node.querySelector('[data-shade="back"]'),
      cast: node.querySelector("[data-cast]"),
    };

    // Take the sheet off its transition so it tracks the pointer.
    for (const el of [node, dragRef.current.front, dragRef.current.back, dragRef.current.cast]) {
      if (el) el.style.transition = "none";
    }

    setDraggingLeaf(leaf);
    el.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    const d = dragRef.current;
    if (!d) return;

    const dx = e.clientX - d.startX;
    const raw = d.forward ? -dx / d.half : dx / d.half;
    d.progress = Math.min(1, Math.max(0, raw));

    // How far over the sheet is, 0 flat to 1 fully turned.
    const t = d.forward ? d.progress : 1 - d.progress;
    // Peaks edge-on, where a real page catches least light.
    const edgeOn = 1 - Math.abs(0.5 - t) * 2;

    d.node.style.transform = `rotateY(${-180 * t}deg)`;
    if (d.front) d.front.style.opacity = (0.5 * t + 0.32 * edgeOn).toFixed(3);
    if (d.back) d.back.style.opacity = (0.6 * (1 - t) + 0.32 * edgeOn).toFixed(3);
    if (d.cast) d.cast.style.opacity = (0.65 * edgeOn).toFixed(3);
  }

  function endDrag(e) {
    const d = dragRef.current;
    if (!d) return;

    bookRef.current?.releasePointerCapture?.(e.pointerId);
    dragRef.current = null;
    setDraggingLeaf(null);

    const settled = d.progress > 0.33;
    const turnedNow = settled ? d.forward : !d.forward;

    // Hand the sheet back to the stylesheet, then set where it lands.
    // React only rewrites `transform` when the state actually changes,
    // so a sheet that falls back has to be told where to return to.
    for (const el of [d.node, d.front, d.back, d.cast]) {
      if (el) el.style.transition = "";
    }
    d.node.style.transform = `rotateY(${turnedNow ? -180 : 0}deg)`;
    if (d.front) d.front.style.opacity = turnedNow ? "0.5" : "0";
    if (d.back) d.back.style.opacity = turnedNow ? "0" : "0.6";
    if (d.cast) d.cast.style.opacity = "0";

    if (settled) go(d.forward ? d.leaf + 1 : d.leaf);
  }

  /* ── Swiping on a single page ──────────────────────────────── */

  function onTouchStart(e) {
    if (isSpread) return;
    dragRef.current = { startX: e.touches[0].clientX, progress: 0 };
  }

  function onTouchEnd(e) {
    const d = dragRef.current;
    if (!d || isSpread) return;
    dragRef.current = null;

    const dx = e.changedTouches[0].clientX - d.startX;
    if (Math.abs(dx) < 45) return;
    if (dx < 0) next();
    else prev();
  }

  const label = closed
    ? "Front cover"
    : turned === 1
      ? "Contents"
      : atEnd
        ? "End"
        : `Frame ${currentProject.frame} of ${projects.length}`;

  return (
    <>
      <PlateHeading
        number="II"
        title="Exposures"
        note={isSpread ? "Drag a page to turn it" : "Swipe to turn the page"}
      />

      <div
        role="group"
        aria-label="Project album"
        aria-roledescription="Album. Use the left and right arrow keys to turn pages."
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative mx-auto w-full max-w-[1080px] rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-gold"
        style={{ perspective: "2400px" }}
      >
        {isSpread ? (
          <motion.div
            ref={bookRef}
            data-book
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            // Closed, the album sits centred; opening it spreads to two pages.
            animate={{ x: shut ? "-25%" : "0%" }}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
            className={`relative mx-auto w-full select-none ${
              draggingLeaf !== null ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              height: "min(560px, 56vh)",
              transformStyle: "preserve-3d",
              touchAction: "pan-y",
            }}
          >
            {/* Under-pages: what lies beneath the leaves at either end.
                While the album is shut they'd read as a slab of board
                behind a centred cover, so they stay out of sight until
                it opens. */}
            <div
              className={`gutter-r absolute inset-y-0 left-0 w-1/2 overflow-hidden border border-edge bg-board transition-opacity duration-500 ${
                shut ? "opacity-0" : "opacity-100"
              }`}
            />
            <div
              className={`gutter-l absolute inset-y-0 right-0 w-1/2 overflow-hidden border border-edge bg-board transition-opacity duration-500 ${
                shut ? "opacity-0" : "opacity-100"
              }`}
            >
              <EndPage />
            </div>

            {Array.from({ length: LEAVES }, (_, i) => (
              <Leaf
                key={i}
                nodeRef={(el) => {
                  leafNodes.current[i] = el;
                }}
                isTurned={i < turned}
                zIndex={i < turned ? LEAVES + i : LEAVES - i}
                front={leafFront(i, jump)}
                back={leafBack(i)}
                showPeel={i === turned || i === turned - 1}
                isTop={i === turned}
              />
            ))}

            {/* Shown until the first page is turned. */}
            <AnimatePresence>
              {!hasTurned && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="pointer-events-none absolute -bottom-9 right-0 flex items-center gap-2"
                >
                  <span className="edge text-gold">Drag the corner</span>
                  <motion.span
                    // An endlessly repeating nudge is the sort of motion
                    // the reduced-motion setting exists to stop.
                    animate={reduce ? undefined : { x: [0, -7, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="text-gold"
                    aria-hidden="true"
                  >
                    <ChevronLeft size={15} />
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Single-page album for narrow screens */
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative w-full select-none overflow-hidden border border-edge bg-board"
            style={{ height: "min(520px, 68vh)", touchAction: "pan-y" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={turned}
                initial={{ rotateY: 32, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -32, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.36, 0.06, 0.16, 1] }}
                className="h-full origin-left"
              >
                {closed ? (
                  <FrontCover />
                ) : turned === 1 ? (
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

      <div className="mx-auto mt-12 flex w-full max-w-[1080px] items-center justify-between">
        <button
          type="button"
          onClick={prev}
          disabled={closed}
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
          {label}
        </p>

        <button
          type="button"
          onClick={next}
          disabled={atEnd}
          className="group flex items-center gap-2 text-silver transition-colors hover:text-gold disabled:pointer-events-none disabled:opacity-30"
        >
          <span className="edge">{closed ? "Open the album" : "Turn"}</span>
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
