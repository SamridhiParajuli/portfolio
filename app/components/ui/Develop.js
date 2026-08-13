"use client";

import Image from "next/image";
import { useInView } from "./useInView";

/**
 * The signature transition. A photograph surfaces from a blown-out
 * latent negative, through the grey of a half-fixed print, into a
 * positive image — with a safelight sweep crossing it once on the way.
 */
export default function Develop({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  delay = 0,
  duration = 1500,
  sweep = true,
}) {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-edge grain ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={
          inView
            ? {
                animation: `develop ${duration}ms cubic-bezier(0.22, 0.7, 0.3, 1) ${delay}ms both`,
              }
            : { opacity: 0 }
        }
      />

      {sweep && inView && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/3 z-[3] w-1/3 bg-gradient-to-r from-transparent via-gold/25 to-transparent"
          style={{
            animation: `safelight ${duration + 300}ms ease-out ${delay}ms both`,
          }}
        />
      )}
    </div>
  );
}
