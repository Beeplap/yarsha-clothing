"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";

import { FullscreenMenu } from "@/components/fullscreen-menu";
import { MenuIcon } from "@/components/menu-icon";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasMenuOpen = useRef(false);

  useEffect(() => {
    const siteFrame = document.querySelector<HTMLElement>(".site-frame");
    const previousBodyOverflow = document.body.style.overflow;
    const previousFrameOverflowY = siteFrame?.style.overflowY ?? "";

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      if (siteFrame) {
        siteFrame.style.overflowY = "hidden";
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      if (siteFrame) {
        siteFrame.style.overflowY = previousFrameOverflowY;
      }
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (wasMenuOpen.current && !isMenuOpen) {
      menuButtonRef.current?.focus({ preventScroll: true });
    }

    wasMenuOpen.current = isMenuOpen;
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current);
  };

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setIsMenuOpen(false);

    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    window.dispatchEvent(new CustomEvent("yarsha:home-transition"));
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[90]">
        <div className="relative h-[calc(4.1666vw+clamp(3.125rem,4.1666vw,6.5rem))] min-h-[4.75rem] w-full">
          <Link
            href="/"
            className="pointer-events-auto absolute left-[4.1666vw] top-[4.1666vw] block"
            aria-label="Yarsha Byte home"
            onClick={handleLogoClick}
          >
            <Image
              src="/ico-bg.png"
              
              alt="Yarsha Byte logo"
              width={104}
              height={104}
              className="size-[4rem] shrink-0 object-contain sm:size-[5.5rem] lg:size-[clamp(4.5rem,6.5vw,7.5rem)]"
              priority
              unoptimized
            />
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-controls="site-menu"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
            className="pointer-events-auto absolute right-[4.1666vw] top-[4.1666vw] grid h-[3.125rem] w-10 shrink-0 place-items-center text-foreground transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:h-[3.75rem] sm:w-14 lg:h-[clamp(3.75rem,4.1666vw,6.5rem)] lg:w-20"
          >
            <MenuIcon open={isMenuOpen} />
          </button>
        </div>
      </header>

      <FullscreenMenu open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
