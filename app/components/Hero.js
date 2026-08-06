import { Mail, ArrowDown } from "lucide-react";

function GithubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 22.29 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center max-w-5xl mx-auto px-6">
      <p className="text-oxblood font-mono text-sm mb-6 tracking-wide">Toronto, Canada</p>

      <h1 className="font-display text-5xl sm:text-7xl font-bold leading-tight tracking-tight">
        Samridhi
        <br />
        Parajuli
      </h1>

      <p className="mt-8 text-lg sm:text-xl text-graphite max-w-2xl leading-relaxed">
        Full stack developer building AI-powered web applications. I work across Next.js, Python, and FastAPI, most recently on a speech-to-SQL system that lets you query databases by voice.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <a href="#projects" className="px-6 py-3 bg-oxblood text-paper font-medium rounded-lg hover:opacity-90 transition-opacity">
          View my work
        </a>
        <a href="mailto:samridhiii.parajuli@gmail.com" className="px-6 py-3 border border-rule rounded-lg hover:border-oxblood hover:text-oxblood transition-colors">
          Get in touch
        </a>
      </div>

      <div className="mt-12 flex gap-5 text-graphite">
        <a href="https://github.com/SamridhiParajuli" target="_blank" rel="noopener noreferrer" className="hover:text-oxblood transition-colors" aria-label="GitHub">
          <GithubIcon />
        </a>
        <a href="https://linkedin.com/in/SamridhiParajuli" target="_blank" rel="noopener noreferrer" className="hover:text-oxblood transition-colors" aria-label="LinkedIn">
          <LinkedinIcon />
        </a>
        <a href="mailto:samridhiii.parajuli@gmail.com" className="hover:text-oxblood transition-colors" aria-label="Email">
          <Mail size={22} />
        </a>
      </div>

      <ArrowDown className="mt-20 text-graphite animate-bounce" size={20} aria-hidden="true" />
    </section>
  );
}