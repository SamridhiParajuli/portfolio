import { Fraunces, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata = {
  title: "Samridhi Parajuli — Full Stack Developer",
  description:
    "An archive of work by Samridhi Parajuli, a full stack developer in Toronto building AI-powered web applications with Next.js, Python, and FastAPI.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
