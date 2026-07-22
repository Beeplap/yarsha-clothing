"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Product } from "@/types/database";
import { useCart } from "@/context/cart-context";
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("yarsha_wishlist");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setWishlistItems(parsed);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromWishlist = (id: string) => {
    const updated = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updated);
    try {
      localStorage.setItem("yarsha_wishlist", JSON.stringify(updated));
      toast.success("Item removed from wishlist");
    } catch {
      // ignore
    }
  };

  const handleMoveToBag = async (product: Product) => {
    try {
      await addToCart(product, 1, "M");
      toast.success(`${product.name} added to your bag!`);
    } catch {
      toast.error("Failed to add item to bag");
    }
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 5vw 5rem 5vw", fontFamily: "var(--body-font)", color: "var(--foreground)", minHeight: "80vh" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "2rem", borderBottom: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)", paddingBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          MY WISHLIST <span style={{ fontSize: "1.25rem", fontWeight: 600, color: "color-mix(in srgb, var(--foreground) 50%, transparent)", textTransform: "none" }}>({wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"})</span>
        </h1>
      </div>

      {loading ? (
        <div style={{ padding: "4rem 0", textAlign: "center", color: "color-mix(in srgb, var(--foreground) 60%, transparent)" }}>
          Loading your saved items...
        </div>
      ) : wishlistItems.length === 0 ? (
        /* Empty State Layout - Matched to ScreenClip */
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          
          <p style={{ fontSize: "1.05rem", color: "color-mix(in srgb, var(--foreground) 80%, transparent)", margin: 0, maxWidth: "700px", lineHeight: 1.6 }}>
            You haven&apos;t saved any items to your wishlist yet. Start shopping and add your favorite items to your wishlist.
          </p>

          {/* Promotional App & Wishlist Card */}
          <div 
            style={{
              maxWidth: "750px",
              backgroundColor: "color-mix(in srgb, var(--foreground) 3%, var(--background))",
              border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)",
              borderRadius: "16px",
              padding: "2.5rem",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)"
            }}
          >
            <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.05, pointerEvents: "none" }}>
              <Sparkles size={200} />
            </div>

            <h2 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "1.5rem", letterSpacing: "-0.5px" }}>
              Get more from your wishlist through the app
            </h2>

            <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: 0, margin: "0 0 2.5rem 0", listStyle: "none" }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.95rem", lineHeight: 1.5 }}>
                <span style={{ fontSize: "1.2rem", lineHeight: 1, marginTop: "2px" }}>•</span>
                <span>Instant notifications on items on sale or low in stock</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.95rem", lineHeight: 1.5 }}>
                <span style={{ fontSize: "1.2rem", lineHeight: 1, marginTop: "2px" }}>•</span>
                <span>Share your wishlist with friends and family</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.95rem", lineHeight: 1.5 }}>
                <span style={{ fontSize: "1.2rem", lineHeight: 1, marginTop: "2px" }}>•</span>
                <span>See which wishlist items are eligible for a voucher</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.95rem", lineHeight: 1.5 }}>
                <span style={{ fontSize: "1.2rem", lineHeight: 1, marginTop: "2px" }}>•</span>
                <span>Get 50 YarshaClub points and unlock more rewards with the app</span>
              </li>
            </ul>

            {/* QR Code Scan Footer Box */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 800 }}>Scan to download the Yarsha Wears app</span>
                <span style={{ color: "color-mix(in srgb, var(--foreground) 40%, transparent)" }}>➔</span>
              </div>

              {/* Vector SVG Mock QR Code */}
              <div style={{ backgroundColor: "#ffffff", padding: "10px", borderRadius: "12px", border: "1px solid #e5e5e5", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <rect x="2" y="2" width="7" height="7" fill="#000" />
                  <rect x="15" y="2" width="7" height="7" fill="#000" />
                  <rect x="2" y="15" width="7" height="7" fill="#000" />
                  <rect x="4" y="4" width="3" height="3" fill="#fff" />
                  <rect x="17" y="4" width="3" height="3" fill="#fff" />
                  <rect x="4" y="17" width="3" height="3" fill="#fff" />
                  <rect x="11" y="4" width="2" height="5" fill="#000" />
                  <rect x="14" y="12" width="4" height="2" fill="#000" />
                  <rect x="11" y="15" width="2" height="7" fill="#000" />
                  <rect x="15" y="17" width="5" height="5" fill="#000" />
                </svg>
              </div>
            </div>

          </div>

          <div style={{ marginTop: "1rem" }}>
            <Link 
              href="/products" 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.875rem 2rem",
                borderRadius: "30px",
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
              }}
            >
              Explore Catalog <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      ) : (
        /* Wishlist Items Grid */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem" }}>
          {wishlistItems.map((item) => (
            <div 
              key={item.id}
              style={{
                border: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div style={{ aspectRatio: "1/1", position: "relative", backgroundColor: "#f3f3f3" }}>
                <img 
                  src={item.images?.[0] || "/placeholder-product.jpg"} 
                  alt={item.name} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                    color: "#dc2626"
                  }}
                  title="Remove from wishlist"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 0.5rem 0", lineHeight: 1.3 }}>
                    <Link href={`/products/${item.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {item.name}
                    </Link>
                  </h3>
                  <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--foreground)", margin: "0 0 1rem 0" }}>
                    Rs. {Number(item.price).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => handleMoveToBag(item)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "24px",
                    backgroundColor: "var(--accent)",
                    color: "#ffffff",
                    border: "none",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <ShoppingBag size={16} /> Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
