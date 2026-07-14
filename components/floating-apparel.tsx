"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

export default function FloatingApparel() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const elements = containerRef.current.querySelectorAll('.floating-item');
    
    // Initial random floating animation (idle)
    elements.forEach((el, i) => {
      gsap.to(el, {
        y: `+=${Math.random() * 30 + 15}`,
        x: `+=${Math.random() * 20 - 10}`,
        rotation: Math.random() * 10 - 5,
        duration: Math.random() * 2 + 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2,
      });
    });

    // Scroll-based parallax
    elements.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-speed') || '1');
      
      gsap.to(el, {
        y: (i, target) => -ScrollTrigger.maxScroll(window) * speed * 0.1,
        rotation: (i, target) => speed * 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        }
      });
    });

    // Mouse movement parallax (subtle)
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 2;
      const yPos = (clientY / window.innerHeight - 0.5) * 2;

      elements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-speed') || '1');
        gsap.to(el, {
          x: xPos * 40 * speed,
          y: yPos * 40 * speed,
          duration: 1,
          ease: "power2.out",
          overwrite: "auto"
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="floating-apparel-container" 
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      {/* Jacket */}
      <div 
        className="floating-item" 
        data-speed="1.5"
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '280px',
          height: '280px',
          opacity: 0.6,
          filter: 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.4))',
          mixBlendMode: 'screen'
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', maskImage: 'radial-gradient(circle, black 40%, transparent 70%)' }}>
          <Image 
            src="/3d_jacket_demo_1783944867609.jpg" 
            alt="Futuristic Jacket" 
            fill 
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>

      {/* Sneaker */}
      <div 
        className="floating-item" 
        data-speed="2.2"
        style={{
          position: 'absolute',
          top: '60%',
          right: '5%',
          width: '220px',
          height: '220px',
          opacity: 0.8,
          filter: 'drop-shadow(0 0 30px rgba(14, 165, 233, 0.5))',
          mixBlendMode: 'screen'
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', maskImage: 'radial-gradient(circle, black 40%, transparent 70%)' }}>
          <Image 
            src="/3d_sneaker_demo_1783944853267.jpg" 
            alt="Cyber Sneaker" 
            fill 
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>

      {/* Backpack / Cap */}
      <div 
        className="floating-item" 
        data-speed="0.8"
        style={{
          position: 'absolute',
          top: '75%',
          left: '20%',
          width: '180px',
          height: '180px',
          opacity: 0.5,
          filter: 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.3))',
          mixBlendMode: 'screen'
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', maskImage: 'radial-gradient(circle, black 40%, transparent 70%)' }}>
          <Image 
            src="/3d_backpack_demo_1783944881032.jpg" 
            alt="Tech Backpack" 
            fill 
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Abstract Glowing Orbs to fill space */}
      <div 
        className="floating-item" 
        data-speed="3"
        style={{
          position: 'absolute',
          top: '20%',
          right: '25%',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#00d4ff',
          boxShadow: '0 0 40px 20px rgba(0, 212, 255, 0.4)'
        }}
      />
      <div 
        className="floating-item" 
        data-speed="0.5"
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '45%',
          width: '15px',
          height: '15px',
          borderRadius: '50%',
          background: '#f97316',
          boxShadow: '0 0 50px 25px rgba(249, 115, 22, 0.3)'
        }}
      />
    </div>
  );
}
