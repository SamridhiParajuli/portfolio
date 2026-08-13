import Rail from "./components/Rail";
import Plate from "./components/ui/Plate";
import Cover from "./components/Cover";
import Subject from "./components/Subject";
import Album from "./components/Album";
import Negative from "./components/Negative";
import Provenance from "./components/Provenance";
import Stamps from "./components/Stamps";
import Colophon from "./components/Colophon";

export default function Home() {
  return (
    <>
      <a
        href="#exposures"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:text-ground"
      >
        Skip to the work
      </a>

      <Rail />

      <main>
        {/* The cover doesn't turn — you're already looking at it. */}
        <Plate id="cover" flat>
          <Cover />
        </Plate>

        <Plate id="subject" className="border-t border-edge">
          <Subject />
        </Plate>

        <Plate id="exposures" className="border-t border-edge">
          <div className="w-full px-6 py-[clamp(1.5rem,5vh,4rem)] sm:px-10 xl:pl-[108px]">
            <div className="mx-auto max-w-6xl">
              <Album />
            </div>
          </div>
        </Plate>

        <Plate id="negative" className="border-t border-edge">
          <Negative />
        </Plate>

        <Plate id="provenance" className="border-t border-edge">
          <Provenance />
        </Plate>

        <Plate id="stamps" className="border-t border-edge">
          <Stamps />
        </Plate>

        <Plate id="colophon" className="border-t border-edge">
          <Colophon />
        </Plate>
      </main>
    </>
  );
}
