"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ParallaxShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const item1Ref = useRef<HTMLDivElement>(null);
  const item2Ref = useRef<HTMLDivElement>(null);
  const item3Ref = useRef<HTMLDivElement>(null);
  
  const textRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const section = sectionRef.current;
    const item1 = item1Ref.current;
    const item2 = item2Ref.current;
    const item3 = item3Ref.current;
    const text = textRef.current;
    const heading = headingRef.current;

    const ctx = gsap.context(() => {
      // ── Character-by-character text reveal for heading ──────────────
      if (heading) {
        const originalText = heading.textContent || "";
        heading.innerHTML = "";
        heading.style.overflow = "hidden";

        const chars: HTMLSpanElement[] = [];
        for (const char of originalText) {
          const span = document.createElement("span");
          span.textContent = char === " " ? "\u00A0" : char;
          span.style.display = "inline-block";
          span.style.opacity = "0";
          span.style.transform = "translateY(120%) rotateX(-90deg)";
          span.style.willChange = "transform, opacity";
          heading.appendChild(span);
          chars.push(span);
        }

        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          toggleActions: "play none none none",
          onEnter: () => {
            gsap.to(chars, {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.7,
              stagger: 0.04,
              ease: "power3.out",
            });
          },
        });
      }

      // ── Main scroll-synced timeline (more dramatic) ────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // 1st Item - Dramatic slide from left with horizontal spread
      if (item1) {
        tl.fromTo(
          item1,
          {
            x: "-120%",
            y: 150,
            rotation: -25,
            scale: 0.6,
            opacity: 0,
          },
          {
            x: "-8%",
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            clearProps: "opacity",
          },
          0
        );
      }

      // 2nd Item - Dramatic slide from right with horizontal spread
      if (item2) {
        tl.fromTo(
          item2,
          {
            x: "120%",
            y: 200,
            rotation: 25,
            scale: 0.6,
            opacity: 0,
          },
          {
            x: "8%",
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            clearProps: "opacity",
          },
          0.1
        );
      }

      // 3rd Item (center) - Dramatic rise from bottom
      if (item3) {
        tl.fromTo(
          item3,
          {
            y: 400,
            scale: 0.3,
            opacity: 0,
            rotation: 10,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            rotation: 0,
            ease: "power2.out",
            clearProps: "opacity",
          },
          0.2
        );
      }

      // Text parallax with more dramatic movement
      if (text) {
        tl.fromTo(
          text,
          { y: 200, opacity: 0 },
          { y: -80, opacity: 1, ease: "power1.inOut" },
          0
        );
      }

      // ── Glow effect on image borders ───────────────────────────────
      const imageWrappers = section.querySelectorAll(
        ".parallax-showcase__image-wrapper"
      );
      imageWrappers.forEach((wrapper) => {
        // Create glow border overlay
        const glowEl = document.createElement("div");
        glowEl.style.cssText = `
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          pointer-events: none;
          z-index: 2;
          opacity: 0;
          border: 2px solid transparent;
          background: linear-gradient(135deg, rgba(0,255,200,0.3), rgba(120,0,255,0.3)) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          box-shadow: 0 0 20px rgba(0,255,200,0.15), inset 0 0 20px rgba(120,0,255,0.1);
        `;
        (wrapper as HTMLElement).style.position = "relative";
        wrapper.appendChild(glowEl);

        ScrollTrigger.create({
          trigger: wrapper,
          start: "top 80%",
          toggleActions: "play none none none",
          onEnter: () => {
            gsap.to(glowEl, {
              opacity: 1,
              duration: 1.2,
              ease: "power2.inOut",
            });
            // Pulsating glow
            gsap.to(glowEl, {
              boxShadow:
                "0 0 40px rgba(0,255,200,0.3), inset 0 0 40px rgba(120,0,255,0.2)",
              duration: 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          },
        });
      });

      // ── Horizontal spread as you scroll past ───────────────────────
      const spreadTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "40% center",
          end: "bottom top",
          scrub: 2,
        },
      });

      if (item1) {
        spreadTl.to(item1, { x: "-15%", ease: "none" }, 0);
      }
      if (item2) {
        spreadTl.to(item2, { x: "15%", ease: "none" }, 0);
      }
      if (item3) {
        spreadTl.to(item3, { y: -20, ease: "none" }, 0);
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="parallax-showcase">
      <div className="parallax-showcase__container">
        
        <div ref={textRef} className="parallax-showcase__text">
          <h2 ref={headingRef}>The Next Dimension</h2>
          <p>Experience ultra-premium 3D wearables designed for the modern metaverse and beyond. Immersive. Futuristic. Yarsha.</p>
        </div>

        <div className="parallax-showcase__grid">
          
          <div ref={item1Ref} className="parallax-showcase__item" style={{ opacity: 0, willChange: 'transform, opacity' }}>
            <div className="parallax-showcase__image-wrapper" style={{ position: "relative", width: "100%", aspectRatio: "3/4", borderRadius: "1rem", overflow: "hidden", background: "#000" }}>
              <Image 
                src="/3d_sneaker_demo_1783944853267.jpg" 
                alt="3D Premium Sneaker" 
                fill 
                className="parallax-showcase__img" 
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="parallax-showcase__info">
              <h3>Aero X1 Sneaker</h3>
              <p>Quantum-lite soles with neon fiber accents.</p>
            </div>
          </div>

          <div ref={item3Ref} className="parallax-showcase__item parallax-showcase__item--center" style={{ opacity: 0, willChange: 'transform, opacity' }}>
            <div className="parallax-showcase__image-wrapper" style={{ position: "relative", width: "100%", aspectRatio: "3/4", borderRadius: "1rem", overflow: "hidden", background: "#000" }}>
              <Image 
                src="/3d_jacket_demo_1783944867609.jpg" 
                alt="3D Techwear Jacket" 
                fill 
                className="parallax-showcase__img" 
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="parallax-showcase__info">
              <h3>Holo-Shell Jacket</h3>
              <p>Adaptive thermoregulation in a sleek metallic finish.</p>
            </div>
          </div>

          <div ref={item2Ref} className="parallax-showcase__item" style={{ opacity: 0, willChange: 'transform, opacity' }}>
            <div className="parallax-showcase__image-wrapper" style={{ position: "relative", width: "100%", aspectRatio: "3/4", borderRadius: "1rem", overflow: "hidden", background: "#000" }}>
              <Image 
                src="/3d_backpack_demo_1783944881032.jpg" 
                alt="3D Minimalist Backpack" 
                fill 
                className="parallax-showcase__img" 
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="parallax-showcase__info">
              <h3>Carbon Pack</h3>
              <p>Indestructible matte carbon exterior.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
