"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Category } from "@/types/database";

// Predefined visuals for category cards
const CATEGORY_VISUALS: Record<string, { gradient: string; icon: string }> = {
  men: {
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    icon: "👔",
  },
  women: {
    gradient: "linear-gradient(135deg, #4a1942 0%, #6b2fa0 100%)",
    icon: "👗",
  },
  accessories: {
    gradient: "linear-gradient(135deg, #2d3436 0%, #636e72 100%)",
    icon: "⌚",
  },
  "winter-wear": {
    gradient: "linear-gradient(135deg, #0c2461 0%, #1e3799 100%)",
    icon: "🧥",
  },
  default: {
    gradient: "linear-gradient(135deg, #2d3436 0%, #636e72 100%)",
    icon: "🏷️",
  },
};

interface CategorySliderProps {
  categories: Category[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="cat-slider">
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
