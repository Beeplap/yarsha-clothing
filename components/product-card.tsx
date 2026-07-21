"use client";

import Link from "next/link";
import type { Product } from "@/types/database";
import { useCart } from "@/context/cart-context";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const SWATCH_COLORS = [
  { name: "Tan", hex: "#b86a2c" },
  { name: "Black", hex: "#1e1a18" },
  { name: "Cream", hex: "#f5efe7" },
  { name: "Plum", hex: "#33202a" },
  { name: "Olive", hex: "#4a5d4e" },
];

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) /
          product.compare_at_price!) *
          100
      )
    : 0;

  const primaryImage =
    product.images?.[0] || "/placeholder-product.jpg";

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      const defaultSize = product.sizes?.[0] || "M";
      await addToCart(product, 1, defaultSize);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // Ignore
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "var(--body-font)",
        color: "var(--foreground)",
      }}
    >
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "color-mix(in srgb, var(--foreground) 5%, transparent)",
            marginBottom: "0.75rem",
          }}
        >
          <img
            src={primaryImage}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
            }}
          />

          {/* Top Badge (Etsy / Modern Style) */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              color: "#111",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "20px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              textTransform: "capitalize",
            }}
          >
            {product.is_featured ? "Popular now" : hasDiscount ? "Bestseller" : "Popular"}
          </div>
        </div>
      </Link>

      {/* Color Swatches Row */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.5rem" }}>
        {SWATCH_COLORS.slice(0, 4).map((c, idx) => (
          <span
            key={idx}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: c.hex,
              border: c.hex === "#f5efe7" ? "1px solid #ccc" : "none",
              display: "inline-block",
            }}
          />
        ))}
        <span style={{ fontSize: "0.75rem", color: "color-mix(in srgb, var(--foreground) 60%, transparent)" }}>
          +3
        </span>
      </div>

      {/* Product Name */}
      <Link href={`/products/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 500,
            lineHeight: 1.3,
            margin: "0 0 0.25rem 0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.name}
        </h3>
      </Link>

      {/* Rating & Seller Row */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", color: "color-mix(in srgb, var(--foreground) 70%, transparent)", marginBottom: "0.4rem" }}>
        <span style={{ fontWeight: 700, color: "var(--foreground)" }}>5.0</span>
        <span style={{ color: "var(--accent)" }}>★</span>
        <span>(104)</span>
        <span>•</span>
        <span style={{ fontWeight: 500 }}>By Yarsha Wears</span>
      </div>

      {/* Price Row */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--foreground)" }}>
          Rs. {Number(product.price).toLocaleString()}
        </span>
        {hasDiscount && (
          <>
            <span style={{ fontSize: "0.85rem", textDecoration: "line-through", color: "color-mix(in srgb, var(--foreground) 45%, transparent)" }}>
              Rs. {Number(product.compare_at_price!).toLocaleString()}
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent)" }}>
              ({discountPercent}% off)
            </span>
          </>
        )}
      </div>

      {/* Action Row: + Add to basket & More like this */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginTop: "auto" }}>
        <button
          onClick={handleQuickAdd}
          disabled={adding}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 14px",
            borderRadius: "20px",
            border: "1px solid var(--foreground)",
            backgroundColor: added ? "var(--accent)" : "transparent",
            color: added ? "#fff" : "var(--foreground)",
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {adding ? "..." : added ? "✓ Added" : "+ Add to basket"}
        </button>

        <Link
          href={`/products/${product.slug}`}
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--foreground)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
          }}
        >
          More like this →
        </Link>
      </div>
    </div>
  );
}
