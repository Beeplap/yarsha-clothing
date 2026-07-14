"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutClientAnimations() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hero Text Parallax & Fade
      gsap.to(".about-hero__content", {
        yPercent: 50,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      // 2. Story Section Pinning
      // Pin the left side visual while the right side text scrolls
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": function() {
          gsap.to(".about-story__visual-wrapper", {
            scrollTrigger: {
              trigger: ".about-story",
              start: "top 15%",
              end: "bottom bottom",
              pin: ".about-story__visual-wrapper",
              pinSpacing: false,
              scrub: true
            }
          });
        }
      });

      // 3. Values Horizontal Scroll
      const valuesWrapper = document.querySelector(".about-values__scroll-wrapper");
      const valuesContainer = document.querySelector(".about-values__container");
      
      if (valuesWrapper && valuesContainer) {
        // Calculate the distance to scroll horizontally
        const getScrollAmount = () => {
          let wrapperWidth = valuesWrapper.scrollWidth;
          return -(wrapperWidth - window.innerWidth + 40); // 40px for padding
        };

        const tween = gsap.to(valuesWrapper, {
          x: getScrollAmount,
          ease: "none"
        });

        ScrollTrigger.create({
          trigger: ".about-values-section",
          start: "top top",
          end: () => `+=${getScrollAmount() * -1}`,
          pin: true,
          animation: tween,
          scrub: 1,
          invalidateOnRefresh: true
        });
      }

      // 4. Quote Text Reveal
      const quoteText = document.querySelector(".about-vision__quote-text");
      if (quoteText && quoteText.textContent) {
        // Split text manually for character reveal
        const text = quoteText.textContent;
        quoteText.textContent = "";
        
        const chars = text.split("").map(char => {
          const span = document.createElement("span");
          span.textContent = char;
          span.style.opacity = "0.2";
          quoteText.appendChild(span);
          return span;
        });

        gsap.to(chars, {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-vision",
            start: "top 70%",
            end: "top 30%",
            scrub: true,
          }
        });
      }

      // 5. Glow Divider Animation
      gsap.fromTo(".glow-divider-line", 
        { scaleX: 0, opacity: 0 },
        { 
          scaleX: 1, 
          opacity: 1, 
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-cta",
            start: "top 80%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return <div ref={containerRef} id="about-animations-portal" style={{ display: 'none' }} />;
}
