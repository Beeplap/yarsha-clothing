"use client";

import Lenis from "lenis";
import gsap from "gsap";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function useLenisScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (
      reduceMotion ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 767px)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    const onLenisScroll = (event: {
      scroll: number;
      velocity: number;
      direction: number;
    }) => {
      ScrollTrigger.update();
      window.dispatchEvent(
        new CustomEvent("lenis:scroll", {
          detail: {
            scroll: event.scroll,
            velocity: event.velocity,
            direction: event.direction,
          },
        }),
      );
    };

    lenis.on("scroll", onLenisScroll);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();
    const frame = document.querySelector<HTMLElement>(".site-frame");
    if (frame) {
      frame.dataset.lenisReady = "true";
    }
    window.dispatchEvent(
      new CustomEvent("lenis:ready", {
        detail: { scroll: lenis.scroll },
      }),
    );

    return () => {
      if (frame) {
        delete frame.dataset.lenisReady;
      }
      gsap.ticker.remove(onTick);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, [reduceMotion]);
}
