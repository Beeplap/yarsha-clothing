"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Product } from "@/types/database";
import { useCart } from "@/context/cart-context";
import { ShoppingBag, Trash2, ArrowRight, Eye, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import PaginationBar from "@/components/pagination-bar";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { items: cartItems, addToCart } = useCart();
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Wishlist
        const storedWishlist = localStorage.getItem("yarsha_wishlist");
        if (storedWishlist) {
          const parsed = JSON.parse(storedWishlist);
          if (Array.isArray(parsed)) setWishlistItems(parsed);
        }

        // Load Recently Viewed from localStorage
        const storedRecent = localStorage.getItem("yarsha_recently_viewed");
        let recentList: Product[] = storedRecent ? JSON.parse(storedRecent) : [];
        if (!Array.isArray(recentList)) recentList = [];

        // If local recent list is empty, fetch top featured products as fallback
        if (recentList.length === 0) {
          const { data } = await supabase
            .from("products")
            .select("*")
            .limit(6);
          if (data && data.length > 0) {
            recentList = data as unknown as Product[];
          }
        }

        setRecentlyViewed(recentList);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
      <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)", paddingBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          MY WISHLIST <span style={{ fontSize: "1.25rem", fontWeight: 600, color: "color-mix(in srgb, var(--foreground) 50%, transparent)", textTransform: "none" }}>({wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"})</span>
        </h1>
      </div>

      {loading ? (
        <div style={{ padding: "4rem 0", textAlign: "center", color: "color-mix(in srgb, var(--foreground) 60%, transparent)" }}>
          Loading your saved items...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
          
          {/* Section 1: Wishlist Items / Empty Wishlist State */}
          <div>
            {wishlistItems.length === 0 ? (
              <div 
                style={{
                  padding: "3rem 2rem",
                  borderRadius: "20px",
                  backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))",
                  border: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
                  marginBottom: "1rem"
                }}
              >
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.5rem 0", textTransform: "uppercase" }}>Your wishlist is empty</h2>
                <p style={{ fontSize: "1.05rem", color: "color-mix(in srgb, var(--foreground) 75%, transparent)", margin: "0 0 1.5rem 0", maxWidth: "650px", lineHeight: 1.6 }}>
                  You haven&apos;t saved any items to your wishlist yet. Start shopping and tap the heart icon on any product to save your favorite items.
                </p>
                <Link 
                  href="/products" 
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.85rem 1.75rem",
                    borderRadius: "30px",
                    backgroundColor: "var(--foreground)",
                    color: "var(--background)",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  Explore Collections <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
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

          {/* Section 2: Items in Your Bag (Only displayed if cart has items) */}
          {cartItems.filter((i) => i.product).length > 0 && (
            <div style={{ borderTop: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)", paddingTop: "3rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5px", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                  <ShoppingBag style={{ color: "var(--accent)" }} /> ITEMS IN YOUR BAG ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
                <Link 
                  href="/cart"
                  style={{
                    color: "var(--accent)",
                    fontWeight: 800,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  View Bag &amp; Checkout →
                </Link>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
                {cartItems.filter((i): i is typeof i & { product: Product } => Boolean(i.product)).map((cartItem) => (
                  <div
                    key={`${cartItem.id}-${cartItem.size}`}
                    style={{
                      border: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
                      borderRadius: "16px",
                      padding: "1rem",
                      backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem"
                    }}
                  >
                    <div style={{ width: "70px", height: "70px", borderRadius: "12px", overflow: "hidden", backgroundColor: "#f3f3f3", flexShrink: 0 }}>
                      <img 
                        src={cartItem.product.images?.[0] || "/placeholder-product.jpg"} 
                        alt={cartItem.product.name} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.25rem 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cartItem.product.name}
                      </h4>
                      <div style={{ fontSize: "0.8rem", color: "color-mix(in srgb, var(--foreground) 65%, transparent)", marginBottom: "0.25rem" }}>
                        Size: {cartItem.size || "Standard"} | Qty: {cartItem.quantity}
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 800 }}>
                        Rs. {(Number(cartItem.product.price) * cartItem.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Recently Explored Products */}
          {recentlyViewed.length > 0 && (
            <div style={{ borderTop: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)", paddingTop: "3rem" }}>
              <div style={{ marginBottom: "1.75rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 0.35rem 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Eye style={{ color: "var(--accent)" }} /> RECENTLY EXPLORED PRODUCTS
                </h2>
                <p style={{ fontSize: "0.9rem", color: "color-mix(in srgb, var(--foreground) 65%, transparent)", margin: 0 }}>
                  Items you have recently viewed on Yarsha Wears.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
                {recentlyViewed.map((item) => (
                  <div 
                    key={item.id}
                    style={{
                      border: "1px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      backgroundColor: "color-mix(in srgb, var(--foreground) 2%, var(--background))",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div style={{ aspectRatio: "1/1", position: "relative", backgroundColor: "#f3f3f3" }}>
                        <img 
                          src={item.images?.[0] || "/placeholder-product.jpg"} 
                          alt={item.name} 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        />
                      </div>
                      <div style={{ padding: "1rem" }}>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.35rem 0", lineHeight: 1.3 }}>
                          <Link href={`/products/${item.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                            {item.name}
                          </Link>
                        </h4>
                        <p style={{ fontSize: "1rem", fontWeight: 800, margin: 0 }}>
                          Rs. {Number(item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div style={{ padding: "0 1rem 1rem 1rem" }}>
                      <Link 
                        href={`/products/${item.slug}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          width: "100%",
                          padding: "0.6rem",
                          borderRadius: "20px",
                          backgroundColor: "color-mix(in srgb, var(--foreground) 6%, transparent)",
                          color: "var(--foreground)",
                          textDecoration: "none",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          textTransform: "uppercase"
                        }}
                      >
                        View Product →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Pagination Bar Footer */}
          <PaginationBar
            currentPage={1}
            totalPages={1}
            viewAllHref="/products"
          />

        </div>
      )}
    </div>
  );
}
