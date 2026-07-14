"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Custom Cursor Component ─────────────────────────────────────────────────
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot follows instantly
      gsap.set(dot, { x: mouseX, y: mouseY });
    };

    // Outer ring follows with lerp via GSAP ticker
    const followCursor = () => {
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const onMouseEnterInteractive = () => {
      gsap.to(cursor, {
        scale: 2.5,
        opacity: 0.5,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(dot, {
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onMouseLeaveInteractive = () => {
      gsap.to(cursor, {
        scale: 1,
        opacity: 0.6,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    gsap.ticker.add(followCursor);

    // Observe for interactive elements
    const addInteractiveListeners = () => {
      const interactiveEls = document.querySelectorAll(
        "a, button, [role='button'], input, select, textarea, .magnetic-btn"
      );
      interactiveEls.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterInteractive);
        el.addEventListener("mouseleave", onMouseLeaveInteractive);
      });
      return interactiveEls;
    };

    const els = addInteractiveListeners();

    // Re-scan on DOM changes
    const observer = new MutationObserver(() => {
      addInteractiveListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Hide cursor on mobile / touch
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) {
      cursor.style.display = "none";
      dot.style.display = "none";
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(followCursor);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.4)",
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          opacity: 0.6,
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />
      <div
        ref={cursorDotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.9)",
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />
    </>
  );
}

// ─── Main GSAP Animations Component ──────────────────────────────────────────
export default function GsapAnimations() {
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  // Animate elements with gsap-fade-* and gsap-scale-in classes
  const animateElement = useCallback(
    (el: Element) => {
      const delay = parseFloat(
        (el as HTMLElement).dataset.gsapDelay || "0"
      );

      let fromVars: gsap.TweenVars = { opacity: 0, duration: 0.8, ease: "power3.out" };
      let toVars: gsap.TweenVars = { opacity: 1, duration: 0.8, ease: "power3.out" };

      if (el.classList.contains("gsap-fade-up")) {
        fromVars = { ...fromVars, y: 60 };
        toVars = { ...toVars, y: 0 };
      } else if (el.classList.contains("gsap-fade-left")) {
        fromVars = { ...fromVars, x: -60 };
        toVars = { ...toVars, x: 0 };
      } else if (el.classList.contains("gsap-fade-right")) {
        fromVars = { ...fromVars, x: 60 };
        toVars = { ...toVars, x: 0 };
      } else if (el.classList.contains("gsap-scale-in")) {
        fromVars = { ...fromVars, scale: 0.85 };
        toVars = { ...toVars, scale: 1 };
      }

      // Check for stagger container parent
      const parent = el.parentElement;
      const isStaggerChild =
        parent?.hasAttribute("data-gsap-stagger") ?? false;

      if (isStaggerChild) {
        // Only animate the first child — stagger handles the rest
        const siblings = Array.from(
          parent!.querySelectorAll(
            ".gsap-fade-up, .gsap-fade-left, .gsap-fade-right, .gsap-scale-in"
          )
        );
        if (siblings[0] !== el) return; // skip non-first children

        const staggerVal = parseFloat(
          parent!.getAttribute("data-gsap-stagger") || "0.1"
        );

        gsap.set(siblings, fromVars);

        const st = ScrollTrigger.create({
          trigger: parent!,
          start: "top 85%",
          toggleActions: "play none none none",
          onEnter: () => {
            const tween = gsap.to(siblings, {
              ...toVars,
              delay,
              stagger: staggerVal,
            });
            tweensRef.current.push(tween);
          },
        });
        triggersRef.current.push(st);
      } else {
        gsap.set(el, fromVars);

        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
          onEnter: () => {
            const tween = gsap.to(el, {
              ...toVars,
              delay,
            });
            tweensRef.current.push(tween);
          },
        });
        triggersRef.current.push(st);
      }
    },
    []
  );

  // Split text animation
  const animateSplitText = useCallback(
    (el: Element) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.dataset.splitDone === "true") return;
      htmlEl.dataset.splitDone = "true";

      const text = htmlEl.textContent || "";
      htmlEl.innerHTML = "";
      htmlEl.style.overflow = "hidden";

      const chars: HTMLSpanElement[] = [];
      for (const char of text) {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(100%) rotateX(-90deg)";
        span.style.willChange = "transform, opacity";
        htmlEl.appendChild(span);
        chars.push(span);
      }

      const st = ScrollTrigger.create({
        trigger: htmlEl,
        start: "top 85%",
        toggleActions: "play none none none",
        onEnter: () => {
          const tween = gsap.to(chars, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.03,
            ease: "power3.out",
          });
          tweensRef.current.push(tween);
        },
      });
      triggersRef.current.push(st);
    },
    []
  );

  // Counter animation
  const animateCounter = useCallback(
    (el: Element) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.dataset.counterDone === "true") return;
      htmlEl.dataset.counterDone = "true";

      const target = parseFloat(htmlEl.dataset.countTo || "0");
      const suffix = htmlEl.dataset.countSuffix || "";
      const prefix = htmlEl.dataset.countPrefix || "";
      const decimals = (htmlEl.dataset.countDecimals)
        ? parseInt(htmlEl.dataset.countDecimals)
        : 0;

      const obj = { val: 0 };
      htmlEl.textContent = `${prefix}0${suffix}`;

      const st = ScrollTrigger.create({
        trigger: htmlEl,
        start: "top 85%",
        toggleActions: "play none none none",
        onEnter: () => {
          const tween = gsap.to(obj, {
            val: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              htmlEl.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`;
            },
          });
          tweensRef.current.push(tween);
        },
      });
      triggersRef.current.push(st);
    },
    []
  );

  // Parallax effect
  const animateParallax = useCallback(
    (el: Element) => {
      const htmlEl = el as HTMLElement;
      const speed = parseFloat(htmlEl.dataset.parallaxSpeed || "0.5");

      const tween = gsap.to(htmlEl, {
        y: () => speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: htmlEl,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      tweensRef.current.push(tween);
      if (tween.scrollTrigger) {
        triggersRef.current.push(tween.scrollTrigger);
      }
    },
    []
  );

  // Magnetic button effect
  const setupMagneticButton = useCallback(
    (el: Element) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.dataset.magneticDone === "true") return;
      htmlEl.dataset.magneticDone = "true";

      const strength = 0.35;

      const onMouseMove = (e: MouseEvent) => {
        const rect = htmlEl.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;

        gsap.to(htmlEl, {
          x: relX * strength,
          y: relY * strength,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const onMouseLeave = () => {
        gsap.to(htmlEl, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
        });
      };

      htmlEl.addEventListener("mousemove", onMouseMove);
      htmlEl.addEventListener("mouseleave", onMouseLeave);

      // Store cleanup refs on the element for potential re-scan
      (htmlEl as HTMLElement & { _magneticCleanup?: () => void })._magneticCleanup = () => {
        htmlEl.removeEventListener("mousemove", onMouseMove);
        htmlEl.removeEventListener("mouseleave", onMouseLeave);
      };
    },
    []
  );

  // Scan and animate all matching elements
  const scanAndAnimate = useCallback(() => {
    if (typeof window === "undefined") return;

    // Fade/scale animations
    const animatableEls = document.querySelectorAll(
      ".gsap-fade-up, .gsap-fade-left, .gsap-fade-right, .gsap-scale-in"
    );
    animatableEls.forEach(animateElement);

    // Split text
    const splitTextEls = document.querySelectorAll(".split-text");
    splitTextEls.forEach(animateSplitText);

    // Counter
    const counterEls = document.querySelectorAll("[data-count-to]");
    counterEls.forEach(animateCounter);

    // Parallax
    const parallaxEls = document.querySelectorAll("[data-parallax-speed]");
    parallaxEls.forEach(animateParallax);

    // Magnetic buttons
    const magneticEls = document.querySelectorAll(".magnetic-btn");
    magneticEls.forEach(setupMagneticButton);

    // Refresh ScrollTrigger after all elements processed
    ScrollTrigger.refresh();
  }, [
    animateElement,
    animateSplitText,
    animateCounter,
    animateParallax,
    setupMagneticButton,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial scan
    // Small delay to allow DOM to settle after hydration
    const initTimeout = setTimeout(() => {
      scanAndAnimate();
    }, 100);

    // MutationObserver to detect dynamically added elements
    const observer = new MutationObserver((mutations) => {
      let shouldRescan = false;
      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as Element;
              if (
                el.querySelector?.(
                  ".gsap-fade-up, .gsap-fade-left, .gsap-fade-right, .gsap-scale-in, .split-text, [data-count-to], [data-parallax-speed], .magnetic-btn"
                ) ||
                el.matches?.(
                  ".gsap-fade-up, .gsap-fade-left, .gsap-fade-right, .gsap-scale-in, .split-text, [data-count-to], [data-parallax-speed], .magnetic-btn"
                )
              ) {
                shouldRescan = true;
                break;
              }
            }
          }
        }
        if (shouldRescan) break;
      }

      if (shouldRescan) {
        // Debounce rescan
        setTimeout(() => scanAndAnimate(), 50);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(initTimeout);
      observer.disconnect();

      // Cleanup all ScrollTrigger instances we created
      triggersRef.current.forEach((st) => st.kill());
      triggersRef.current = [];

      // Kill all tweens we created
      tweensRef.current.forEach((t) => t.kill());
      tweensRef.current = [];

      // Cleanup magnetic buttons
      document.querySelectorAll(".magnetic-btn").forEach((el) => {
        const htmlEl = el as HTMLElement & { _magneticCleanup?: () => void };
        htmlEl._magneticCleanup?.();
      });
    };
  }, [scanAndAnimate]);

  return <CustomCursor />;
}
