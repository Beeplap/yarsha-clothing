"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import type { Category } from "@/types/database";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Predefined visuals for category cards — darker, neon-infused
const CATEGORY_VISUALS: Record<string, { gradient: string; icon: string }> = {
  men: {
    gradient: "linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 50%, #0ff0fc22 100%)",
    icon: "👔",
  },
  women: {
    gradient: "linear-gradient(135deg, #10051a 0%, #3d0066 50%, #c840ff22 100%)",
    icon: "👗",
  },
  accessories: {
    gradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #00ffc822 100%)",
    icon: "⌚",
  },
  "winter-wear": {
    gradient: "linear-gradient(135deg, #050510 0%, #0c1445 50%, #4060ff22 100%)",
    icon: "🧥",
  },
  default: {
    gradient: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #ffffff11 100%)",
    icon: "🏷️",
  },
};

interface CategorySliderProps {
  categories: Category[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;

    const ctx = gsap.context(() => {
      const cards = slider.querySelectorAll(".cat-slider__card");

      if (cards.length > 0) {
        gsap.set(cards, { y: 50, opacity: 0, scale: 0.95 });

        ScrollTrigger.create({
          trigger: slider,
          start: "top 85%",
          toggleActions: "play none none none",
          onEnter: () => {
            gsap.to(cards, {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              stagger: 0.12,
              ease: "power3.out",
            });
          },
        });

        // Subtle floating animation on each card (continuous)
        cards.forEach((card, i) => {
          gsap.to(card, {
            y: "-=6",
            duration: 2 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2,
          });
        });
      }
    }, slider);

    return () => {
      ctx.revert();
    };
  }, [categories]);

  return (
    <div className="cat-slider" ref={sliderRef}>
      <button
        className="cat-slider__arrow cat-slider__arrow--left"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div className="cat-slider__track" ref={scrollRef}>
        {categories.map((cat) => {
          const visual =
            CATEGORY_VISUALS[cat.slug] || CATEGORY_VISUALS.default;
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="cat-slider__card"
              style={{ background: visual.gradient }}
            >
              <span className="cat-slider__icon">{visual.icon}</span>
              <span className="cat-slider__label">{cat.name}</span>
              <span className="cat-slider__cta">
                Shop Now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>

      <button
        className="cat-slider__arrow cat-slider__arrow--right"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
