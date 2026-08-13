import Develop from "./ui/Develop";
import Reveal from "./ui/Reveal";
import PlateHeading from "./ui/PlateHeading";
import { education } from "../data/portfolio";

/** Where the work came from, in the order it happened. The dates
 *  carry the sequence, so nothing here needs numbering. */
export default function Provenance() {
  return (
    <div className="w-full px-6 py-[clamp(1.5rem,5vh,4rem)] sm:px-10 xl:pl-[108px]">
      <div className="mx-auto max-w-6xl">
        <PlateHeading number="IV" title="Provenance" note="Where this came from" />

        <ol className="relative">
          {/* The thread running through the file */}
          <span
            aria-hidden="true"
            className="absolute left-[7px] top-2 hidden h-[calc(100%-2rem)] w-px bg-edge sm:block"
          />

          {education.map((entry, i) => (
            <li key={entry.title} className="relative pb-10 last:pb-0 sm:pl-14">
              <span
                aria-hidden="true"
                className="absolute left-0 top-2 hidden h-[15px] w-[15px] rounded-full border border-gold bg-ground sm:block"
              />

              <Reveal delay={i * 100}>
                <div className="grid gap-5 lg:grid-cols-[0.5fr_1.5fr] lg:gap-9">
                  <div className="crop-marks p-2">
                    <Develop
                      src={entry.src}
                      alt=""
                      sizes="(max-width: 1024px) 92vw, 24vw"
                      className="h-[min(20vh,170px)] w-full"
                    />
                  </div>

                  <div>
                    <p className="edge text-gold">{entry.period}</p>
                    <h3 className="display mt-2 text-[clamp(1.15rem,2vw,1.75rem)] leading-tight text-print">
                      {entry.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-emulsion">
                      {entry.org}
                      <span className="text-silver"> · {entry.place}</span>
                    </p>
                    <p className="mt-2.5 max-w-xl text-[clamp(0.8rem,1vw,0.9rem)] leading-relaxed text-silver">
                      {entry.note}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
