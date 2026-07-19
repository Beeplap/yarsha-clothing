"use client";

import dynamic from "next/dynamic";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { CanvasLoader } from "@/components/three/CanvasLoader";

const HeroCanvas = dynamic(
  () =>
    import("@/components/three/HeroCanvas").then((mod) => mod.HeroCanvas),
  {
    ssr: false,
    loading: () => <CanvasLoader />,
  },
);

/** Buzzworthy-style blob: free-floating, no visible container. */
export function HeroCanvasShell() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const frame = document.querySelector(".site-frame");
    
    const handleScroll = () => {
      if (frame) {
        container.style.transform = `translate3d(0, -${frame.scrollTop}px, 0)`;
      }
    };

    const handleLenisScroll = (e: Event) => {
      const scroll = (e as CustomEvent<{ scroll: number }>).detail?.scroll || 0;
      container.style.transform = `translate3d(0, -${scroll}px, 0)`;
    };

    if (frame) {
      frame.addEventListener("scroll", handleScroll, { passive: true });
    }
    window.addEventListener("lenis:scroll", handleLenisScroll);

    return () => {
      if (frame) {
        frame.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("lenis:scroll", handleLenisScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute left-0 top-0 z-[2] w-full h-[100svh] overflow-hidden transition-opacity duration-700 ${
        isHome ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <HeroCanvas />
    </div>
  );
}
