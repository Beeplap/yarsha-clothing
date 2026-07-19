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

    const wrapper = document.querySelector<HTMLElement>(".site-frame");
    const content = document.querySelector<HTMLElement>(".site-frame-content");

    if (!wrapper || !content) {
      return;
    }

    const lenis = new Lenis({
      wrapper,
      content,
      lerp: 0.16,
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

    ScrollTrigger.scrollerProxy(wrapper, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }

        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: wrapper.clientWidth,
          height: wrapper.clientHeight,
        };
      },
      pinType: "transform",
    });

    ScrollTrigger.defaults({ scroller: wrapper });

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();
    wrapper.dataset.lenisReady = "true";
    window.dispatchEvent(
      new CustomEvent("lenis:ready", {
        detail: { scroll: lenis.scroll },
      }),
    );

    return () => {
      delete wrapper.dataset.lenisReady;
      gsap.ticker.remove(onTick);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      ScrollTrigger.scrollerProxy(wrapper, {});
      ScrollTrigger.defaults({ scroller: undefined });
      ScrollTrigger.refresh();
    };
  }, [reduceMotion]);
}
