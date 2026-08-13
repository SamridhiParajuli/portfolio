import Develop from "./ui/Develop";
import Reveal from "./ui/Reveal";
import PlateHeading from "./ui/PlateHeading";
import { about, profile } from "../data/portfolio";

export default function Subject() {
  return (
    <div className="w-full px-6 py-[clamp(1.5rem,5vh,4rem)] sm:px-10 xl:pl-[108px]">
      <div className="mx-auto max-w-6xl">
        <PlateHeading number="I" title={about.captionTitle} note="Gelatin silver print" />

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <Reveal>
            <div className="crop-marks p-2">
              <Develop
                src={profile.portrait}
                alt="Samridhi Parajuli's workspace"
                sizes="(max-width: 1024px) 92vw, 34vw"
                className="h-[min(38vh,340px)] w-full shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* The gallery wall label — mounted below the print, as it
                would be hung. Type is small and the rules are hairlines. */}
            <div className="mt-4 border-t border-edge pt-3">
              <p className="display text-base text-print">{profile.name}</p>
              <p className="edge mt-1.5">{about.captionMeta}</p>
            </div>
          </Reveal>

          <div>
            <Reveal delay={100}>
              <p className="display text-[clamp(1.25rem,2.2vw,1.85rem)] leading-snug text-print">
                {about.lede}
              </p>
            </Reveal>

            {about.body.map((para, i) => (
              <Reveal key={i} delay={200 + i * 100}>
                <p className="mt-4 max-w-xl text-[clamp(0.85rem,1.05vw,1rem)] leading-relaxed text-emulsion">
                  {para}
                </p>
              </Reveal>
            ))}

            <Reveal delay={450}>
              <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-edge pt-6 sm:grid-cols-3">
                {[
                  ["Based in", profile.location],
                  ["Focus", "Full stack + AI"],
                  ["Status", "Open to work"],
                ].map(([term, value]) => (
                  <div key={term}>
                    <dt className="edge">{term}</dt>
                    <dd className="mt-1.5 text-sm text-print">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
