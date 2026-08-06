import { Bodoni_Moda, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
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
    "Full stack developer in Toronto building AI-powered web applications with Next.js, Python, and FastAPI.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${instrument.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}