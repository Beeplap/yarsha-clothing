"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollHexBackground() {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const frame = document.querySelector<HTMLElement>(".site-frame");

    if (!frame || reduceMotion) {
      return;
    }

    let idleTimer = 0;
    let animationFrame = 0;
    let latestScroll = frame.scrollTop || window.scrollY;
    let lastScroll = latestScroll;
    let lastTime = performance.now();
    let shouldRevealPattern = false;

    const HARD_WHEEL_DELTA = 120;
    const HARD_SCROLL_VELOCITY = 1.25;
    const VISIBLE_OPACITY = "0.24";

    const setPatternState = () => {
      const offset = latestScroll * 1.15;

      frame.style.setProperty("--hex-offset-y", `${offset}px`);
      frame.style.setProperty("--hex-offset-x", `${offset * 0.34}px`);

      if (!shouldRevealPattern) {
        return;
      }

      frame.style.setProperty("--hex-opacity", VISIBLE_OPACITY);

      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        frame.style.setProperty("--hex-opacity", "0");
      }, 360);
    };

    const schedulePatternState = () => {
      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        setPatternState();
      });
    };

    const onScroll = () => {
      const now = performance.now();
      latestScroll = frame.scrollTop || window.scrollY;
      const distance = Math.abs(latestScroll - lastScroll);
      const elapsed = Math.max(now - lastTime, 16);

      shouldRevealPattern = distance / elapsed > HARD_SCROLL_VELOCITY;
      lastScroll = latestScroll;
      lastTime = now;

      schedulePatternState();
    };

    const onScrollInput = (event: WheelEvent | TouchEvent) => {
      latestScroll = frame.scrollTop || window.scrollY;
      shouldRevealPattern =
        "deltaY" in event && Math.abs(event.deltaY) > HARD_WHEEL_DELTA;
      schedulePatternState();
    };

    frame.addEventListener("scroll", onScroll, { passive: true });
    frame.addEventListener("wheel", onScrollInput, { passive: true });
    frame.addEventListener("touchmove", onScrollInput, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onScrollInput, { passive: true });
    window.addEventListener("touchmove", onScrollInput, { passive: true });

    return () => {
      frame.removeEventListener("scroll", onScroll);
      frame.removeEventListener("wheel", onScrollInput);
      frame.removeEventListener("touchmove", onScrollInput);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScrollInput);
      window.removeEventListener("touchmove", onScrollInput);
      window.clearTimeout(idleTimer);

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      frame.style.removeProperty("--hex-opacity");
      frame.style.removeProperty("--hex-offset-y");
      frame.style.removeProperty("--hex-offset-x");
    };
  }, [pathname, reduceMotion]);

  return pathname === "/" ? (
    <div className="scroll-hex-background" aria-hidden="true" />
  ) : null;
}
