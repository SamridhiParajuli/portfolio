import Reveal from "./Reveal";

/**
 * A catalogue plate heading. Plates in a photographic archive are
 * genuinely numbered in sequence, so the roman numeral carries real
 * information — it tells you where you are in the album.
 */
export default function PlateHeading({ number, title, note, className = "" }) {
  return (
    <header className={`mb-8 sm:mb-10 ${className}`}>
      <Reveal className="flex items-baseline gap-4 border-b border-edge pb-4">
        <span className="edge text-gold">Plate {number}</span>
        <span className="h-px flex-1 bg-edge" aria-hidden="true" />
        {note && <span className="edge hidden sm:block">{note}</span>}
      </Reveal>

      <Reveal delay={80}>
        <h2 className="display mt-4 text-plate text-print">{title}</h2>
      </Reveal>
    </header>
  );
}
