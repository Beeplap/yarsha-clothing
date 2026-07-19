"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

const DESKTOP = {
  viewBox: "0 0 1420 880",
  full:
    "M0 20C0 8.95429 8.86995 0 19.9156 0C68.0089 0 189.957 0 236.667 0C317.505 0 392.495 0 473.333 0C556.906 0 626.428 0 710 0C800.016 0 856.651 0 946.667 0C1067.34 0 1062.66 0 1183.33 0C1273.85 0 1361.73 0 1400 0C1411.05 0 1420 8.95431 1420 20V860C1420 871.046 1411.05 880 1400 880H20C8.95432 880 0 871.046 0 860V20Z",
  wave:
    "M0 281.943C0 260.021 33.5348 252.576 43.9009 271.893C88.8096 355.58 162.35 466.5 236.667 466.5C356 466.5 365 107.333 472 107.333C579 107.333 626.428 225.5 710 225.5C800.016 225.5 856.651 0.5 946.667 0.5C1067.34 0.5 1062.66 414 1183.33 414C1257.18 414 1329.27 246.617 1374.1 116.704C1381.76 94.5095 1420 100.218 1420 123.698V638C1420 649.046 1411.05 658 1400 658H20C8.95432 658 0 649.046 0 638V281.943Z",
  line:
    "M0 1.5C0 0.671573 0.644757 0 1.47318 0C15.3551 0 125.137 0 236.667 0C356 0 365 0 472 0C579 0 626.428 0 710 0C800.016 0 856.651 0 946.667 0C1067.34 0 1062.66 0 1183.33 0C1296.08 0 1404.74 0 1418.53 0C1419.36 0 1420 0.671573 1420 1.5V1.5C1420 2.32843 1419.33 3 1418.5 3H1.49997C0.671538 3 0 2.32843 0 1.5V1.5Z",
};

const MOBILE = {
  viewBox: "0 0 360 751",
  full:
    "M0 9.92881e-05C23 -0.00012411 47.5 9.92881e-05 60 9.92881e-05C72.5 9.92881e-05 105 9.92881e-05 120 9.92881e-05C135 9.92881e-05 160.5 0 180 0C199.5 0 221 9.92881e-05 240 9.92881e-05C259 9.92881e-05 283 9.92881e-05 300 9.92881e-05C317 9.92881e-05 336 9.92881e-05 360 9.92881e-05C360 34 360 751 360 751H0C0 751 0 35.0003 0 9.92881e-05Z",
  wave:
    "M0 209.5C23 209.5 21 491 60 491C99 491 83 281 120 281C157 281 141 368 180 368C219 368 205 209.5 240 209.5C275 209.5 267 424 300 424C333 424 336 311 360 311C360 345 360 751 360 751H0C0 751 0 244.5 0 209.5Z",
  line:
    "M0 750C23 750 21 750 60 750C99 750 83 750 120 750C157 750 141 750 180 750C219 750 205 750 240 750C275 750 267 750 300 750C333 750 336 750 360 750C360 750.999 360 750.999 360 750.999H0.000144839C0.000144839 750.999 0 750.999 0 750Z",
};

gsap.registerPlugin(MorphSVGPlugin);

export function PageWaveTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const backSvgRef = useRef<SVGSVGElement>(null);
  const frontSvgRef = useRef<SVGSVGElement>(null);
  const backPathRef = useRef<SVGPathElement>(null);
  const frontPathRef = useRef<SVGPathElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const pathnameRef = useRef("/");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const container = containerRef.current;
    const backSvg = backSvgRef.current;
    const frontSvg = frontSvgRef.current;
    const backPath = backPathRef.current;
    const frontPath = frontPathRef.current;

    if (!container || !backSvg || !frontSvg || !backPath || !frontPath) {
      return;
    }

    const resetOverlay = () => {
      gsap.killTweensOf([container, backSvg, frontSvg, backPath, frontPath]);
      gsap.set(container, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(backSvg, {
        yPercent: 0,
        rotation: 180,
        transformOrigin: "50% 0%",
      });
      gsap.set(frontSvg, {
        yPercent: 0,
        rotation: 0,
        transformOrigin: "50% 100%",
      });
    };

    resetOverlay();

    const handleTransition = () => {
      if (timelineRef.current?.isActive()) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const shapes = window.matchMedia("(max-width: 639px)").matches
        ? MOBILE
        : DESKTOP;
      const frame = document.querySelector<HTMLElement>(".site-frame");
      let didRevealHome = false;

      const revealHome = () => {
        if (didRevealHome) {
          return;
        }

        didRevealHome = true;
        frame?.scrollTo({ top: 0, behavior: "auto" });
        window.scrollTo({ top: 0, behavior: "auto" });

        if (pathnameRef.current !== "/") {
          router.push("/");
        }
      };

      window.dispatchEvent(
        new CustomEvent("yarsha:blob-pulse", { detail: { clockwise: true } }),
      );

      if (reduceMotion) {
        revealHome();
        return;
      }

      timelineRef.current?.kill();
      backSvg.setAttribute("viewBox", shapes.viewBox);
      frontSvg.setAttribute("viewBox", shapes.viewBox);

      // Fade in the container to simulate the old content fading out
      gsap.set(container, { pointerEvents: "auto" });
      gsap.to(container, {
        autoAlpha: 1,
        duration: 0.4,
        ease: "power2.inOut",
      });

      gsap.set(backSvg, {
        yPercent: 0,
        rotation: 180,
        transformOrigin: "50% 0%",
      });
      gsap.set(frontSvg, {
        yPercent: 0,
        rotation: 0,
        transformOrigin: "50% 100%",
      });
      gsap.set([backPath, frontPath], { morphSVG: shapes.full });

      const timeline = gsap.timeline({
        onComplete: () => {
          // Fire blob enter right when the cover starts fading so
          // the user sees the full scale-up entrance animation
          window.dispatchEvent(new Event("yarsha:blob-enter"));
          // Fade out the container to simulate the new content fading in
          gsap.to(container, {
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: resetOverlay,
          });
        },
        onInterrupt: () => {
          resetOverlay();
        },
      });

      timeline.timeScale(1.2);

      timeline
        .to(frontPath, {
          morphSVG: shapes.wave,
          duration: 0.8,
          ease: "expo.in",
        }, 0)
        .to(
          frontSvg,
          {
            yPercent: 50,
            duration: 0.8,
            ease: "expo.in",
          },
          0,
        )
        .add(() => window.dispatchEvent(new Event("yarsha:blob-reset")), 0.6)
        .to(frontPath, {
          morphSVG: shapes.line,
          duration: 0.8,
          ease: "expo.out",
        }, 0.8)
        .to(
          frontSvg,
          {
            yPercent: 100,
            duration: 0.8,
            ease: "expo.out",
          },
          0.8,
        )
        .to(
          backPath,
          {
            morphSVG: shapes.wave,
            duration: 0.8,
            ease: "expo.in",
          },
          0.2,
        )
        .to(
          backSvg,
          {
            yPercent: 50,
            duration: 0.8,
            ease: "expo.in",
          },
          0.2,
        )
        .to(backPath, {
          morphSVG: shapes.full,
          duration: 0.8,
          ease: "expo.out",
        }, 1.0)
        .to(
          backSvg,
          {
            yPercent: 100,
            duration: 0.8,
            ease: "expo.out",
          },
          1.0,
        )
        .add(revealHome, 0.9);

      timelineRef.current = timeline;
    };

    window.addEventListener("yarsha:home-transition", handleTransition);

    return () => {
      window.removeEventListener("yarsha:home-transition", handleTransition);
      timelineRef.current?.kill();
      resetOverlay();
    };
  // NOTE: `pathname` is intentionally excluded – the handler reads
  // pathnameRef.current (synced separately) so the listener must NOT
  // be torn down when the route changes mid-transition.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[950] invisible overflow-hidden opacity-0 lg:inset-3 lg:rounded-[1.45rem] bg-background"
      aria-hidden="true"
    >
      <svg
        ref={backSvgRef}
        className="absolute inset-0 h-full w-full"
        viewBox={DESKTOP.viewBox}
        preserveAspectRatio="none"
      >
        <path ref={backPathRef} d={DESKTOP.line} fill="var(--foreground)" />
      </svg>
      <svg
        ref={frontSvgRef}
        className="absolute inset-0 h-full w-full"
        viewBox={DESKTOP.viewBox}
        preserveAspectRatio="none"
      >
        <path ref={frontPathRef} d={DESKTOP.line} fill="var(--foreground)" />
      </svg>
    </div>
  );
}

