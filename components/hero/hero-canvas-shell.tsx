"use client";

import dynamic from "next/dynamic";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

  const [blobVisible, setBlobVisible] = useState(true);

  // Mobile: hide blob on first user interaction, show again when auth modal closes
  useEffect(() => {
    const isMobile = () => window.innerWidth < 768;

    const hideBlob = () => {
      if (isMobile()) setBlobVisible(false);
    };

    const showBlob = () => {
      if (isMobile()) setBlobVisible(true);
    };

    // Hide as soon as user first touches/clicks on mobile
    const handleFirstInteraction = () => {
      hideBlob();
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
    };

    window.addEventListener("touchstart", handleFirstInteraction, { passive: true });
    window.addEventListener("click", handleFirstInteraction);

    // Hide when auth modal opens, show when it closes
    window.addEventListener("yarsha:auth-open", hideBlob);
    window.addEventListener("yarsha:auth-close", showBlob);

    return () => {
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("yarsha:auth-open", hideBlob);
      window.removeEventListener("yarsha:auth-close", showBlob);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute left-0 top-0 z-[2] w-full h-[100svh] overflow-hidden transition-opacity duration-700 ${
        isHome && blobVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <HeroCanvas />
    </div>
  );
}
