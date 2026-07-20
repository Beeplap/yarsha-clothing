"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card";
import type { Product } from "@/types/database";

export function RecentlyViewedSection() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("yarsha_recently_viewed");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed);
        }
      }
    } catch {
      // Ignore JSON errors
    }
  }, []);

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="recently-viewed-section" style={{ padding: "5rem 5vw", backgroundColor: "var(--background)", borderTop: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)" }}>
      <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem" }}>
        <div>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent)" }}>
            Pick up where you left off
          </span>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 900, textTransform: "uppercase", lineHeight: 1.1, marginTop: "0.25rem" }}>
            Still Interested?
          </h2>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("yarsha_recently_viewed");
            setRecentlyViewed([]);
          }}
          style={{
            background: "none",
            border: "none",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--accent)",
            cursor: "pointer",
            textDecoration: "underline",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}
        >
          Clear History
        </button>
      </div>

      <div
        className="products-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "2rem"
        }}
      >
        {recentlyViewed.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
