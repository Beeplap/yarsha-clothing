"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/types/database";
import { useCart } from "@/context/cart-context";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight, Check, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [personalizationText, setPersonalizationText] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addedMessage, setAddedMessage] = useState("");
  const { addToCart } = useCart();

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/placeholder-product.jpg"];

  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["XS", "S", "M", "L", "XL"];
  const colors = product.colors && product.colors.length > 0 ? product.colors : ["Core Black", "Cloud White", "Yarsha Tan"];

  // Store in recently viewed (localStorage + Supabase DB)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("yarsha_recently_viewed");
      let list: Product[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(list)) list = [];

      list = list.filter((p) => p.id !== product.id);
      list.unshift(product);
      if (list.length > 8) list = list.slice(0, 8);

      localStorage.setItem("yarsha_recently_viewed", JSON.stringify(list));
    } catch {
      // Ignore
    }

    // Sync with Supabase for logged-in users
    const supabase = createClient();
    const syncView = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && product.id) {
          const { error } = await supabase.rpc("record_recently_viewed", { p_product_id: product.id });
          if (error) {
            await supabase.from("recently_viewed").upsert(
              { user_id: user.id, product_id: product.id, viewed_at: new Date().toISOString() },
              { onConflict: "user_id,product_id" }
            );
          }
        }
      } catch {
        // ignore
      }
    };
    syncView();
  }, [product]);

  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;

  const inStock = product.stock_quantity > 0;

  const handleAddToCart = async () => {
    if (!selectedSize && sizes.length > 0) {
      setSelectedSize(sizes[0]);
    }
    setAdding(true);
    setAddedMessage("");

    try {
      const finalSize = selectedSize || sizes[0] || "Standard";
      await addToCart(product, quantity, finalSize);
      setAddedMessage("Added to basket!");
      setTimeout(() => setAddedMessage(""), 3500);
    } catch {
      setAddedMessage("Something went wrong.");
    } finally {
      setAdding(false);
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem 5vw 4rem 5vw", fontFamily: "var(--body-font)", color: "var(--foreground)" }}>
      {/* Back link */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          href="/products"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.875rem",
            color: "var(--foreground)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          ← Back to search results
        </Link>
      </div>

      {/* Main 2-Column Product Purchase Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "3rem",
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN: Gallery with vertical thumbnail strip */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          {/* Vertical Thumbnail Strip */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "64px", flexShrink: 0 }}>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: activeImageIndex === idx ? "2px solid var(--foreground)" : "1px solid color-mix(in srgb, var(--foreground) 15%, transparent)",
                  padding: 0,
                  cursor: "pointer",
                  background: "transparent",
                }}
              >
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>

          {/* Main Display Image */}
          <div
            style={{
              position: "relative",
              flex: 1,
              aspectRatio: "1 / 1",
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "color-mix(in srgb, var(--foreground) 4%, transparent)",
            }}
          >
            <img
              src={images[activeImageIndex]}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Top Left Badge: Yarsha's Pick */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                background: "#fef08a",
                color: "#854d0e",
                border: "1.5px dashed #ca8a04",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: "0.8rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <span>✨ Yarsha&apos;s Pick</span>
            </div>

            {/* Top Right Wishlist Heart */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "#ffffff",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                transition: "transform 0.2s ease",
              }}
              aria-label="Add to wishlist"
            >
              <Heart size={20} fill={isWishlisted ? "#e63946" : "none"} stroke={isWishlisted ? "#e63946" : "#111"} />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#ffffff",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  <ChevronLeft size={20} color="#111" />
                </button>

                <button
                  onClick={nextImage}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#ffffff",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  <ChevronRight size={20} color="#111" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Product Info & Purchase Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Large Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
            <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--foreground)" }}>
              Rs. {Number(product.price).toLocaleString()}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: "1.1rem", textDecoration: "line-through", color: "color-mix(in srgb, var(--foreground) 45%, transparent)" }}>
                Rs. {Number(product.compare_at_price!).toLocaleString()}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2, margin: 0 }}>
            {product.name}
          </h1>

          {/* Shop Name & Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
            <span style={{ fontWeight: 700 }}>Yarsha Wears</span>
            <div style={{ display: "flex", color: "#eab308" }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <span style={{ color: "color-mix(in srgb, var(--foreground) 60%, transparent)", fontSize: "0.85rem" }}>(1,280 reviews)</span>
          </div>

          {/* Delivery estimate */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "var(--foreground)", fontWeight: 500 }}>
            <Check size={18} color="var(--accent)" />
            <span>Arrives soon! Get it within 2-4 days in Nepal</span>
          </div>

          {/* Colorway Dropdown */}
          {colors.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 600 }}>Color Option</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid color-mix(in srgb, var(--foreground) 25%, transparent)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              >
                <option value="">Select an option</option>
                {colors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Size Dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600 }}>Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                borderRadius: "8px",
                border: "1px solid color-mix(in srgb, var(--foreground) 25%, transparent)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                fontSize: "0.95rem",
                outline: "none",
              }}
            >
              <option value="">Select Size</option>
              {sizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Add Personalisation Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowPersonalization(!showPersonalization)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--foreground)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>{showPersonalization ? "− Remove custom note" : "+ Add custom note / gift message"}</span>
            </button>

            {showPersonalization && (
              <textarea
                value={personalizationText}
                onChange={(e) => setPersonalizationText(e.target.value)}
                placeholder="Enter custom text or packaging instructions..."
                rows={3}
                style={{
                  width: "100%",
                  marginTop: "0.75rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid color-mix(in srgb, var(--foreground) 20%, transparent)",
                  backgroundColor: "var(--background)",
                  fontSize: "0.9rem",
                }}
              />
            )}
          </div>

          {/* Quantity Box */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600 }}>Quantity</label>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                width: "120px",
                borderRadius: "8px",
                border: "1px solid color-mix(in srgb, var(--foreground) 25%, transparent)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ flex: 1, padding: "0.6rem", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem" }}
              >
                −
              </button>
              <span style={{ flex: 1, textAlign: "center", fontWeight: 700 }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ flex: 1, padding: "0.6rem", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem" }}
              >
                +
              </button>
            </div>
          </div>

          {/* Payment Info Subtext */}
          <div style={{ fontSize: "0.8rem", color: "color-mix(in srgb, var(--foreground) 65%, transparent)" }}>
            Instant digital payment available with <strong>eSewa, Khalti, or Cards</strong>.
          </div>

          {/* Add to Basket CTA Pill Button */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock || adding}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "30px",
              backgroundColor: "var(--foreground)",
              color: "var(--background)",
              border: "none",
              fontSize: "1rem",
              fontWeight: 800,
              cursor: inStock ? "pointer" : "not-allowed",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              transition: "transform 0.15s ease",
            }}
          >
            {adding ? "Adding to basket..." : !inStock ? "Out of Stock" : "Add to basket"}
          </button>

          {addedMessage && (
            <div style={{ textAlign: "center", fontWeight: 700, color: "var(--accent)" }}>
              {addedMessage}
            </div>
          )}

          {/* Star Seller Guarantee Footer */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1.25rem",
              borderRadius: "12px",
              backgroundColor: "color-mix(in srgb, var(--foreground) 4%, transparent)",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "var(--accent)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "1.1rem",
                flexShrink: 0,
              }}
            >
              ★
            </div>
            <div style={{ fontSize: "0.85rem", lineHeight: 1.4 }}>
              <strong>Star Seller.</strong> Yarsha Wears consistently earned 5-star reviews, dispatched orders on time, and replied quickly to any customer inquiries across Nepal.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
