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

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Select all refs
    const item1 = item1Ref.current;
    const item2 = item2Ref.current;
    const item3 = item3Ref.current;
    const text = textRef.current;

    // Create the timeline synced to scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5, // 1.5s smoothing effect
      }
    });

    // 1st Item - Slides in from the left, slight rotation and scale
    if (item1) {
      tl.fromTo(item1, 
        { x: "-100%", y: 100, rotation: -15, scale: 0.8, opacity: 0 },
        { x: "0%", y: 0, rotation: 0, scale: 1, opacity: 1, ease: "power2.out", clearProps: "opacity" },
        0 // Start at beginning of timeline
      );
    }

    // 2nd Item - Slides in from the right
    if (item2) {
      tl.fromTo(item2, 
        { x: "100%", y: 150, rotation: 15, scale: 0.8, opacity: 0 },
        { x: "0%", y: 0, rotation: 0, scale: 1, opacity: 1, ease: "power2.out", clearProps: "opacity" },
        0.1 // Slight delay relative to scroll
      );
    }

    // 3rd Item - Rises from bottom center
    if (item3) {
      tl.fromTo(item3, 
        { y: 300, scale: 0.5, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, ease: "power2.out", clearProps: "opacity" },
        0.2
      );
    }

    // Text Parallax effect
    if (text) {
      tl.fromTo(text,
        { y: 150, opacity: 0 },
        { y: -50, opacity: 1, ease: "power1.inOut" },
        0
      );
    }

    return () => {
      // Cleanup ScrollTrigger instances on unmount
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="parallax-showcase">
      <div className="parallax-showcase__container">
        
        <div ref={textRef} className="parallax-showcase__text">
          <h2>The Next Dimension</h2>
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
