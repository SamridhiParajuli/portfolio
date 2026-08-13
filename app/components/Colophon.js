import { ArrowUpRight, Download, Mail } from "lucide-react";
import Reveal from "./ui/Reveal";
import PlateHeading from "./ui/PlateHeading";
import { profile } from "../data/portfolio";

function GithubIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 22.29 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const LINKS = [
  { href: profile.github, label: "GitHub", Icon: GithubIcon },
  { href: profile.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
];

export default function Colophon() {
  return (
    <div className="w-full px-6 py-[clamp(1.5rem,5vh,4rem)] sm:px-10 xl:pl-[108px]">
      <div className="mx-auto max-w-6xl">
        <PlateHeading number="VI" title="Colophon" note="End of the album" />

        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <Reveal>
              <p className="display max-w-xl text-[clamp(1.25rem,2.2vw,1.85rem)] leading-snug text-print">
                I&apos;m looking for full stack and AI engineering work. If
                you&apos;re hiring — or you just want to talk through something
                you&apos;re building — write to me.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <a
                href={`mailto:${profile.email}`}
                className="group mt-10 flex items-center gap-4 border-b border-edge pb-4 transition-colors hover:border-gold"
              >
                <Mail
                  size={20}
                  className="shrink-0 text-gold"
                  aria-hidden="true"
                />
                <span className="display break-all text-xl text-print transition-colors group-hover:text-gold sm:text-2xl">
                  {profile.email}
                </span>
                <ArrowUpRight
                  size={18}
                  className="ml-auto shrink-0 text-silver transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                  aria-hidden="true"
                />
              </a>
            </Reveal>
          </div>

          <div>
            <Reveal delay={200}>
              <p className="edge">The full record</p>
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 flex items-center justify-between gap-4 border border-gold/60 px-5 py-4 transition-colors hover:bg-gold hover:text-ground"
              >
                <span>
                  <span className="block text-sm font-medium">
                    Résumé
                  </span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] opacity-60">
                    PDF · one page
                  </span>
                </span>
                <Download
                  size={18}
                  className="shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </Reveal>

            <Reveal delay={280}>
              <p className="edge mt-10">Elsewhere</p>
              <ul className="mt-4 flex flex-col gap-3">
                {LINKS.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 text-sm text-emulsion transition-colors hover:text-gold"
                    >
                      <Icon />
                      {label}
                      <ArrowUpRight
                        size={14}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* The real colophon — what the album was made of. */}
        <div className="mt-12 flex flex-col gap-3 border-t border-edge pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="edge">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="edge max-w-md sm:text-right">
            Set in Fraunces, Instrument Sans &amp; IBM Plex Mono · Built with
            Next.js · Photographs are placeholders from Pexels
          </p>
        </div>
      </div>
    </div>
  );
}
